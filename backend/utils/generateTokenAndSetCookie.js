import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
        httpOnly: false,
        sameSite: 'Lax',
        secure: 'False',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // due to the below lines the tokens are not properly fitted in to the browsers so they are commented in production remove this comments
        // sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
        // secure: process.env.NODE_ENV === 'production',
    });

    // Log to verify token generation
    console.log("Generated Token:", token);

    return token;
};