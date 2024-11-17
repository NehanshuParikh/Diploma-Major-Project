import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { Staff } from '../models/staffModel.js';
import { Student } from '../models/studentModel.js';
import { Subject } from '../models/subjectModel.js';
const router = express.Router();

router.get('/profile', verifyToken, async (req, res) => {
  console.log("Profile route accessed by user:", req.user._id, '\n', req.user.fullName); // Log the user info

  try {
    let user;

    // First check if the user is a staff member or HOD
    user = await Staff.findById(req.user._id).select('userId fullName email mobile userType profilePhoto');

    if (user) {
      // If user is found in Staff, return their details
      return res.status(200).json({
        success: true,
        data: {
          userId: user.userId,
          fullName: user.fullName,  // Ensure it is 'fullName' here
          email: user.email,
          mobileNumber: user.mobile,
          userType: user.userType,
          profilePhoto: user.profilePhoto
        }
      });
    }

    // If not found in Staff, check if the user is a student
    user = await Student.findById(req.user._id).select('enrollmentId fullName email mobile profilePhoto');

    if (user) {
      // If user is found in Student, return their details without userType
      return res.status(200).json({
        success: true,
        data: {
          userId: user.enrollmentId, // Assuming enrollmentId is unique identifier for students
          fullName: user.fullName,  // Ensure consistency with 'fullName'
          email: user.email,
          mobileNumber: user.mobile,
          userType: 'Student', // Set userType manually as it's not stored in Student model
          profilePhoto: user.profilePhoto,
        }
      });
    }

    // If user is not found in either model
    return res.status(404).json({ success: false, message: 'User not found' });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// routes for user search suggesting user / staff member in input field
router.get('/search', verifyToken, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    const users = await Staff.find({
      $and: [
        {
          $or: [
            { userId: new RegExp(query, 'i') },
            { fullName: new RegExp(query, 'i') }
          ]
        }
      ]
    }).limit(10);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// routes for subject search suggesting SUbjects in input field
router.get('/search-subject', verifyToken, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    const subjects = await Subject.find({
      $or: [
        { SubjectCode: new RegExp(query, 'i') },
        { SubjectName: new RegExp(query, 'i') },
        { SubjectShortName: new RegExp(query, 'i') }
      ]
    }).limit(10);

    if (subjects.length === 0) {
      return res.status(404).json({ success: false, message: 'No subjects found' });
    }

    res.json({ success: true, subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ success: false, message: 'Error fetching subjects' });
  }
});

// this route is used for fetching user info
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

// route for editing profile
router.post('/edit-profile', verifyToken, async (req, res) => {
  try {
    const { email, mobile, fullName } = req.body;
    console.log(req.body)
    console.log(req.user._id)
    let updatedProfile;
    if (req.user.userType === 'Staff') {
      updatedProfile = await Staff.findByIdAndUpdate(req.user._id, { fullName, mobile, email }, { new: true });
    } else {
      updatedProfile = await Student.findByIdAndUpdate(req.user._id, { fullName, mobile, email }, { new: true });
    }

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: `${req.user.userType} Profile updated successfully`,
      updatedProfile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// route for getting students data of the particular branch and school of HOD / Faculty
router.get('/get-all-students',verifyToken,async (req,res)=>{
  try{
    // get branch and school from req.user and store it in variable
    const branch = req.user.branch;
    const school = req.user.school;
    // fetch inside students database and storer all the students inside a variable
    const students = await Student.find({branch,school}).select('-password -createdAt -updatedAt -email');
    // return that response
    return res.status(200).json({ success: true, message: 'All the students fetched', students });
  } catch {
    return res.status(500).json({ success: false, message: 'Error fetching students' });
  }
})

router.post('/get-particular-unit-students', verifyToken, async (req,res)=>{
  try {
    // take all inputs from the req.body
    const { level, branch, school,semester, division } = req.body;
    console.log(level, branch, school,semester, division)
    // fetch accoridngly inside the students model
    const students = await Student.find({
      level, branch, school, semester, division
    }).select('fullName enrollmentId level branch school division semester email')

    // and then frame the resposne in a strcuitured way
    return res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      students
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching students', error});
  }
})


export default router;
