import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { User } from '../models/userModel.js';

const router = express.Router();

// Route to fetch user profile details
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('userId fullname email mobile userType');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Log the user details before sending the response
        console.log("UserId:", user.userId);
        console.log("Email:", user.email);
        console.log("FullName:", user.fullname);

        // Return user's profile details
        res.status(200).json({
            success: true,
            data: {
                userId: user.userId,
                fullName: user.fullname, // Fixed to match MongoDB document
                email: user.email,
                mobileNumber: user.mobile,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/search/:', verifyToken, async (req,res)=>{

    const { query } = req.query;
    
    try {
      const users = await User.find({
        $or: [
          { userId: new RegExp(query, 'i') },
          { fullname: new RegExp(query, 'i') }
        ]
      }).limit(10); // Limit the results to 10 for performance
    
      res.json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching users' });
    }
})


export default router;
