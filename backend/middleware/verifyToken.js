import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    let token;

    // Try to get the token from cookies first
    token = req.cookies.token;

    // If not in cookies, check in the Authorization header
    if (!token) {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    // Log where the token is coming from for debugging
    console.log("Token from cookies:", req.cookies.token);
    console.log("Token from headers:", req.headers['authorization']);

    // If no token is found, return an error
    if (!token) {
        return res.status(403).json({ success: false, message: "Access Denied. No Token Provided." });
    }

    try {
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded userId: ", decoded.userId);

        // Find the user based on the decoded userId
        const user = await User.findOne({_id:  decoded.userId});

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }


        // Attach user to request
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ success: false, message: "Invalid Token." });
    }
};
