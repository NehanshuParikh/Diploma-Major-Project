import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
        req.user = await User.findById(decoded.userId); // Attach user to req
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
