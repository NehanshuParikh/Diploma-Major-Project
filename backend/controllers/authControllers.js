import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";
// Create __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const signup = async (req, res) => {
    const { userId, email, password, userType, fullname, mobile } = req.body
    try {
        if (!userId, !password, !userType, !email, !fullname, !mobile) {
            throw new Error("All Fields Are Required");
        }

        const userAlreadyExists = await User.findOne({ userId })
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User Already Exists" })
        }

        const passAlreadyExists = await User.findOne({ password })
        if (passAlreadyExists) {
            return res.status(400).json({ success: false, message: "Password Already Exists" })
        }
        // Generate a salt
        const salt = await bcrypt.genSalt(10); // 10 is the number of salt rounds, can be adjusted
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            userId,
            email,
            password: hashedPassword,
            userType,
            fullname,
            mobile,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000 // token / otp expires in 10 minutes
        })



        await user.save();
        // jwt
        generateTokenAndSetCookie(res, user._id)
        await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({ success: true, message: "User created Successfully OTP sent on email for verification", user: { ...user._doc, password: undefined } })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const { userId, password } = req.body;
    try {
        if (!userId || !password) {
            return res.status(400).json({ success: false, message: "UserID and Password are required" });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({ success: false, message: "User Does Not Exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid UserID or Password" });
        }

        // Generate OTP for two-factor authentication
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await user.save();

        // Send the OTP to user's email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(200).json({ success: true, message: "OTP sent to email for verification" });

    } catch (error) {
        console.error('Error during login controller:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token"); // Corrected method name (clearCookie)
    res.status(200).json({ success: true, message: "Logged Out Successfully" }); // Fixed typo in message key
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() } // checking if the verification token/otp is still valid
        });

        if (!user) {
            return res.status(400).json({
                success: false, message: "Invalid Or Expired Verification OTP"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        // Logging to check if the user was found and saved
        console.log('User verified and saved:', user);

        // Check userType and redirect accordingly
        if (user.userType === 'Faculty' || user.userType === 'HOD') {
            return res.status(200).json({ message: 'Login successful', redirectTo: '/api/marksManagement' });
        } else if (user.userType === 'Student') {
            return res.status(200).json({ message: 'Login successful', redirectTo: '/api/studentDashboard' });
        } else {
            return res.status(400).json({ message: 'Invalid userType' });
        }

        // Sending the welcome email
        await sendWelcomeEmail(user.email);

        // Logging to check if the email was sent
        console.log('Welcome email sent to:', user.email);

        res.status(200).json({ success: true, message: "Email verified successfully", user: { ...user._doc, password: undefined } });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginVerify = async (req, res) => {
    const { code } = req.body; // Only taking the OTP from the request
    try {
        console.log(`Received OTP: ${code}`); // Debugging: Check the received OTP

        // Find the user by the OTP code and ensure the OTP is still valid
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() } // Check if the OTP is still valid
        });

        if (!user) {
            console.log('User not found or OTP expired'); // Debugging: Log if the user is not found or OTP is expired
            return res.status(400).json({ success: false, message: "Invalid or Expired Verification OTP" });
        }

        // Mark the OTP as used
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        user.isVerified = true; // Mark the user as verified after OTP verification
        await user.save();

        // After successful authentication
        const token = generateTokenAndSetCookie(res, user._id);

        console.log("Generated Token:", token);
        console.log('User verified and logged in successfully'); // Debugging: Log success

        // Check userType and redirect accordingly
        if (user.userType === 'Faculty' || user.userType === 'HOD') {
            return res.status(200).json({ message: 'Login successful', redirectTo: '/api/marksManagement' });
        } else if (user.userType === 'Student') {
            return res.status(200).json({ message: 'Login successful', redirectTo: '/api/studentDashboard' });
        } else {
            return res.status(400).json({ message: 'Invalid userType' });
        }

    } catch (error) {
        console.error('Error during login verification:', error); // Debugging: Log any errors
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const forgotPassword = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOne({ userId }); // Corrected line
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token or OTP
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        // Update user with reset token
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // Send reset email
        await sendPasswordResetEmail(user.email, user.userId, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ success: true, message: "Reset Email Sent successfully" });

    } catch (error) {
        console.log("Error in forgot password handler:", error);
        res.status(400).json({ success: false, message: error.message });
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        console.log(`Received token: ${token}`);
        console.log(`Received password: ${password}`);

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log("Error in reset password handler:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
export const checkAuth = async (req, res, next) => {
    try {
        // Ensure req.userId is properly set
        const userId = req.user;

        // Find user by ID
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, messsage: "User is authenticated" });
        next()
    } catch (error) {
        console.log("Error in checkAuth handler:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


