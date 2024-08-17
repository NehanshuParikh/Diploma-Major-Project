import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Try to get the token from cookies
    let token = req.cookies.token;

    // If not in cookies, check in the headers
    if (!token) {
        token = req.headers['authorization']?.split(' ')[1]; // Authorization: Bearer <token>
    }

    // Log to check where the token is coming from
    console.log("Token from cookies:", req.cookies.token);
    console.log("Token from headers:", req.headers['authorization']);

    if (!token) {
        return res.status(403).json({ success: false, message: "Access Denied. No Token Provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token." });
    }
};
