import { Staff } from "../models/staffModel.js";
import { Student } from "../models/studentModel.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";
import owasp from 'owasp-password-strength-test'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { profile } from "console";
// Create __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const signup = async (req, res) => {
    const { userId, email, password, userType, fullName, mobile, branch, school, level, division } = req.body;
    const profilePhotoLocalPath = req.file?.path;

    // Assuming you're receiving `enrollmentDate` in `req.body`
    const enrollmentDate = new Date(req.body.enrollmentDate);

    if (isNaN(enrollmentDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid enrollment date' });
    }


    try {
        // Check for missing fields
        if (!userId || !password || !userType || !email || !fullName || !mobile || !branch || !school) {
            return res.status(400).json({ success: false, message: "All Fields Are Required" });
        }

        // Additional validation for students
        if (userType === 'Student' && (!level || !enrollmentDate || !division)) {
            return res.status(400).json({ success: false, message: 'Level and Enrollment Date are required for students.' });
        }


        // Check for profile photo
        if (!profilePhotoLocalPath) {
            return res.status(400).json({ success: false, message: 'Profile Photo is required' });
        }

        // Password validation
        const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        if (password === userId) {
            return res.status(400).json({ success: false, message: "Password cannot be the same as UserID" });
        }

        if (!passwordValidationRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character"
            });
        }

        owasp.config({
            minLength: 8,
            minOptionalTestsToPass: 4
        });

        const result = owasp.test(password);
        if (!result.strong) {
            return res.status(400).json({
                success: false,
                message: "Password is too weak. " + result.errors.join(' ')
            });
        }

        // Check if user or student already exists
        const staffAlreadyExists = await Staff.findOne({ userId });
        if (staffAlreadyExists) {
            return res.status(400).json({ success: false, message: "Staff Already Exists" });
        }

        const staffPassAlreadyExists = await Staff.findOne({ password });
        if (staffPassAlreadyExists) {
            return res.status(400).json({ success: false, message: "Password Already Exists" });
        }

        const studentAlreadyExists = await Student.findOne({ enrollmentId: userId });
        if (studentAlreadyExists) {
            return res.status(400).json({ success: false, message: "Student Already Exists" });
        }

        const studentPassAlreadyExists = await Student.findOne({ password });
        if (studentPassAlreadyExists) {
            return res.status(400).json({ success: false, message: "Password Already Exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Upload profile photo
        const profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);
        if (!profilePhoto) {
            return res.status(400).json({ success: false, message: 'Profile photo not uploaded on cloudinary' });
        }

        function calculateCurrentSemester(enrollmentDate) {
            const now = new Date();
            const diffInMonths = (now.getFullYear() - enrollmentDate.getFullYear()) * 12 + (now.getMonth() - enrollmentDate.getMonth());
            const currentSemester = Math.floor(diffInMonths / 6) + 1;
            console.log(`Calculated Semester: ${currentSemester}, Enrollment Date: ${enrollmentDate}`);
            return currentSemester;
        }



        if (userType === 'Student') {
            const student = new Student({
                enrollmentId: userId,
                email,
                profilePhoto,
                password: hashedPassword,
                fullName,
                division,
                mobile,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
                branch,
                school,
                level,
                semester: calculateCurrentSemester(enrollmentDate),
                enrollmentDate
            });
            await student.save();

            // After successful authentication, generate token and set cookie
            const token = generateTokenAndSetCookie(res, student._id);
            console.log("Generated Token:", token);

            await sendVerificationEmail(email, verificationToken);

            return res.status(201).json({ success: true, message: "Student created / registered Successfully. OTP sent on email for verification.", user: { ...student._doc, password: undefined } });

        } else {
            const staff = new Staff({
                userId,
                email,
                profilePhoto,
                password: hashedPassword,
                userType,
                fullName,
                mobile,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
                branch,
                school
            });

            await staff.save();
            await sendVerificationEmail(email, verificationToken);

            return res.status(201).json({ success: true, message: "Staff Member created / registered Successfully. OTP sent on email for verification.", user: { ...staff._doc, password: undefined } });

        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


export const login = async (req, res) => {
    const { userId, password } = req.body;
    try {
        if (!userId || !password) {
            return res.status(400).json({ success: false, message: "UserID and Password are required" });
        }

        // Check if the user is a Staff member
        let user = await Staff.findOne({ userId });
        // If not found, check if it's a Student
        if (!user) {
            user = await Student.findOne({ enrollmentId: userId }); // Assuming you use enrollmentId for students
            if (!user) {
                return res.status(400).json({ success: false, message: "Student or Staff With this userId Does Not Exist" });
            }
        }

        // Validate the password
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

        return res.status(200).json({ success: true, message: "OTP sent to email for verification" });

    } catch (error) {
        console.error('Error during login controller:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const logout = async (req, res) => {
    res.clearCookie("token"); // Corrected method name (clearCookie)
    res.status(200).json({ success: true, message: "Logged Out Successfully" }); // Fixed typo in message key
    console.log('User Logged Out')
};

export const verifyEmail = async (req, res) => {
    const { code, userId } = req.body; // Include userId in the request body
    try {
        // Check if the user is a Staff member
        let user = await Staff.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        // If not found in Staff, check in Student
        if (!user) {
            user = await Student.findOne({
                verificationToken: code,
                verificationTokenExpiresAt: { $gt: Date.now() }
            });
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Or Expired Verification OTP"
            });
        }

        // Mark the user as verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        // After successful authentication, generate token and set cookie
        const token = generateTokenAndSetCookie(res, user._id);
        console.log("Generated Token:", token);

        console.log('User verified and saved:', user);

        await sendWelcomeEmail(user.email);
        console.log('Welcome email sent to:', user.email);

        return res.status(200).json({
            message: 'Verification successful',
            userType: user.userType
        });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginVerify = async (req, res) => {
    const { code } = req.body; // Taking the OTP from the request
    try {
        console.log(`Received OTP: ${code}`); // Debugging: Check the received OTP

        // Find the user by the OTP code and ensure the OTP is still valid
        let user = await Staff.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() } // Check if the OTP is still valid
        });

        // If not found, check the Student model
        if (!user) {
            user = await Student.findOne({
                verificationToken: code,
                verificationTokenExpiresAt: { $gt: Date.now() }
            });
        }

        // Check if user was found
        if (!user) {
            console.log('User not found or OTP expired'); // Debugging: Log if the user is not found or OTP is expired
            return res.status(400).json({ success: false, message: "Invalid or Expired Verification OTP" });
        }

        // Mark the OTP as used
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        user.isVerified = true; // Mark the user as verified after OTP verification
        await user.save();

        // After successful authentication, generate token and set cookie
        const token = generateTokenAndSetCookie(res, user._id);
        console.log("Generated Token:", token);
        console.log('User verified and logged in successfully'); // Debugging: Log success

        // Check userType and respond accordingly
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            userType: user.userType // Assuming userType exists in both Staff and Student models
        });

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
        await sendPasswordResetEmail(user.email, user.userId, `${process.env.CLIENT_URL}/api/auth/reset-password/${resetToken}`);
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


