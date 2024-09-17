import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/HOD-dashboard', verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to HOD Dashboard" });
});

router.get('/Faculty-dashboard', verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to Faculty Dashboard" });
});

router.get('/Student-dashboard', verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to Student Dashboard" });
});

export default router;
