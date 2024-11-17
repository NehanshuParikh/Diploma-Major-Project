import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js';
import { Staff } from '../models/staffModel.js';
import { Unit } from '../models/unitModel.js';
import { Subject } from '../models/subjectModel.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/assign-units', verifyToken, async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        // Destructuring SubjectFromRequest
        const { FacultyUserId, Level, Branch, School, Semester, SubjectFromRequest, Division } = req.body;

        // Check if any field is missing
        if (!FacultyUserId || !Level || !Branch || !School || !Semester || !SubjectFromRequest || !Division) {
            console.log('Missing required fields');
            return res.status(500).json({ success: false, message: 'All fields are required' });
        }

        const HODId = req.user._id;

        console.log('Finding faculty:', FacultyUserId);
        const faculty = await Staff.findOne({ userId: FacultyUserId });
        if (!faculty) {
            console.log('Faculty not found');
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }

        console.log('Finding subject:', SubjectFromRequest);
        const subject = await Subject.findOne({ SubjectCode: SubjectFromRequest });
        if (!subject) {
            console.log('Subject not found');
            return res.status(404).json({ success: false, message: 'Subject not found' });
        }

        console.log('Creating unit with:', { HODId, facultyId: faculty._id, Level, Branch, School, Semester, Subject: subject._id, Division });

        const unit = await new Unit({
            HODId,
            FacultyId: faculty._id,
            Level,
            Branch,
            School,
            Semester,
            Subject: subject._id,
            Division
        });

        await unit.save();
        res.status(201).json({ success: true, message: "Unit Created Successfully", unit });
    } catch (error) {
        console.error('Error assigning unit:', error);
        res.status(500).json({ success: false, message: 'An error occurred while assigning the unit' });
    }
});

// route for faculty / HOD to view particularly their units so they can take their normal Attendance
router.get('/view-units', verifyToken, async (req, res) => {
    try {
        // Take the logged-in user details from verifyToken in a variable
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: 'Please Authenticate yourself' });

        // Search for all the units where FacultyId matches the logged-in user's ID
        const units = await Unit.find({ FacultyId: user._id });

        // Check if units are found and respond accordingly
        if (!units.length) {
            return res.status(200).json({ success: true, message: 'No units found for this faculty' });
        }

        // Use Promise.all to fetch HOD, faculty, and subject details for each unit
        const unitsWithDetails = await Promise.all(units.map(async (unit) => {
            const hod = await Staff.findById(unit.HODId); // Fetch HOD details for each unit
            const faculty = await Staff.findById(unit.FacultyId); // Fetch Faculty details for each unit
            const subject = await Subject.findById(unit.Subject); // Fetch Subject details for each unit

            // Return a new object excluding unwanted fields
            return {
                hod: {
                    id: hod._id,
                    fullName: hod.fullName,
                    email: hod.email,
                },
                subject: {
                    id: subject._id,
                    name: subject.SubjectName,
                    code: subject.SubjectCode,
                },
                faculty: {
                    id: faculty._id,
                    fullName: faculty.fullName,
                    email: faculty.email,
                },
                // Add any other properties you want to include from the unit
                Level: unit.Level,
                Branch: unit.Branch,
                School: unit.School,
                Semester: unit.Semester,
                Division: unit.Division,
            };
        }));

        // Respond with the retrieved units including HOD and Subject details
        res.status(200).json({
            success: true,
            message: "Units retrieved successfully",
            units: unitsWithDetails // Send the units with HOD and Subject details
        });
    } catch (error) {
        console.error('Error retrieving units:', error);
        res.status(500).json({ success: false, message: "Error retrieving units from backend", error: error.message });
    }
});

// route for faculty / HOD to view all of the units so they can take proxy Attendance
router.get('/view-all-units', verifyToken, async (req, res) => {
    try {
      const units = await Unit.find()
        .populate('HODId')
        .populate('FacultyId')
        .populate('Subject');
  
      const userId = req.user._id;
  
      // Filter out units that belong to the logged-in user
      const filteredUnits = units.filter(unit =>
        unit.FacultyId._id.toString() !== userId.toString()
      );
  
      // Map filtered units to format the response
      const formattedUnits = filteredUnits.map(unit => ({
        hod: {
          id: unit.HODId._id,
          fullName: unit.HODId.fullName,
          email: unit.HODId.email,
        },
        subject: {
          id: unit.Subject._id,
          name: unit.Subject.SubjectName,
          code: unit.Subject.SubjectCode,
        },
        faculty: {
          id: unit.FacultyId._id,
          fullName: unit.FacultyId.fullName,
          email: unit.FacultyId.email,
        },
        // Add other properties from the unit
        Level: unit.Level,
        Branch: unit.Branch,
        School: unit.School,
        Semester: unit.Semester,
        Division: unit.Division,
      }));
  
      res.status(200).json({
        success: true,
        message: "Units retrieved successfully",
        units: formattedUnits,
      });
    } catch (error) {
      console.error('Error retrieving units:', error);
      res.status(500).json({ success: false, message: "Error retrieving units from backend" });
    }
  });
  



export default router