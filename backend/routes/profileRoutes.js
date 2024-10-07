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

// routes for user search
router.get('/search', verifyToken, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    const users = await User.find({
      $and: [
        { userType: { $ne: 'Student' } }, // Exclude students
        {
          $or: [
            { userId: new RegExp(query, 'i') },
            { fullname: new RegExp(query, 'i') }
          ]
        }
      ]
    }).limit(10);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});




router.get('/user-info', verifyToken, (req, res) => {
  // The 'verifyToken' middleware attaches 'req.user'
  const user = req.user;
  if (user) {
    return res.status(200).json({
      userType: user.userType,  // Assuming userType is a field in your user model
      email: user.email,
      fullName: user.fullName,
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
});



export default router;
