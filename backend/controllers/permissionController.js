// controllers/permissionController.js
import { sendPermissionAprovedForMarksInputting } from '../mailtrap/emails.js';
import { PermissionRequest } from '../models/permissionRequestModel.js';
import { User } from '../models/userModel.js'; // Make sure you have a User model to get user details

export const requestPermission = async (req, res) => {
    const { school, branch, subject, semester, level, examType } = req.body;
    const userId = req.user.userId; // Get faculty ID from the logged-in user

    if (!school || !branch || !subject || !semester || !level || !examType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find the HOD for the given branch and school
        const hod = await User.findOne({ userType: 'HOD', department: branch, school: school });

        if (!hod) {
            return res.status(404).json({ message: 'HOD not found for the specified branch and school' });
        }

        // Check if a permission request already exists for these details
        const existingRequest = await PermissionRequest.findOne({
            userId,
            school,
            branch,
            subject,
            semester,
            level,
            examType,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already requested permission for these details' });
        }
        // if we want then we can create the feaure of faculty which reiuests the permission from the HOD will be expired within 7 days. if we want.
        // // Set the expiration time (2 minutes for testing; use 24 hours for production)
        // const duration = 2 * 60 * 1000; // 2 minutes
        // const expiresAt = new Date(Date.now() + duration);

        console.log("Creating PermissionRequest with the following details:");
        console.log({ userId, userId: userId, school, branch, subject, semester, level, examType });


        // Create a new permission request
        const newRequest = new PermissionRequest({
            userId,
            school,
            branch,
            subject,
            semester,
            level,
            examType,
            hodId: hod.userId, // Attach the HOD's ID to the request
            status: 'Pending',
        });

        await newRequest.save();
        res.status(201).json({ message: 'Permission request submitted successfully', newRequest });
    } catch (error) {
        console.error('Error requesting permission:', error);
        res.status(500).json({ message: 'Error requesting permission', error });
    }
};



export const managePermissionRequests = async (req, res) => {
    try {
        const HODBranch = req.user.department;
        const HODSchool = req.user.school;

        const allPermissions = await PermissionRequest.find({
            branch: HODBranch,
            school: HODSchool,
        })

        console.log(allPermissions);
        res.status(201).json({ message: 'Here are the all permissions that are related to your department and school', allPermissions });
    } catch (error) {
        console.error('Error managing permission controller:', error);
        res.status(500).json({ message: 'Error showing permission', error });
    }
};

// Controller to update permission status
export const updatePermissionStatus = async (req, res) => {
    try {
        const { permissionId, status } = req.body; // Expecting permissionId and status (approved/rejected) from the request body

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Please provide either "approved" or "rejected".' });
        }

        // Find the permission request by ID
        const permissionRequest = await PermissionRequest.findById(permissionId);
        if (!permissionRequest) {
            return res.status(404).json({ message: 'Permission request not found.' });
        }

        // Update the status of the permission request
        permissionRequest.status = status;

        // If the status is 'Approved', set the expiration time (e.g., 2 minutes from now)
        if (status === 'Approved') {
            // const expirationDuration = 2 * 60 * 1000; // 2 minutes in milliseconds DEVELOPEMENT PURPOSE
            const expirationDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds PROUCTION PURPOSE
            permissionRequest.expiresAt = new Date(Date.now() + expirationDuration);
            const user = await User.findOne({ userId: permissionRequest.userId });
            if (user) {
                const HODDets = await User.findOne({ userId: permissionRequest.hodId});
                await sendPermissionAprovedForMarksInputting(user.email, permissionRequest.examType, permissionRequest.subject, permissionRequest.level, permissionRequest.branch, permissionRequest.school,permissionRequest.semester,permissionRequest.division,HODDets.fullname);
            } else {
                return res.status(404).json({ message: 'User not found.' });
            }

        } else {
            // If rejected, remove the expiration time
            permissionRequest.expiresAt = null;
        }

        await permissionRequest.save();

        // Send a notification or simply return the updated status to be checked by the faculty
        res.status(200).json({ message: `Permission request has been ${status}.`, permissionRequest });
    } catch (error) {
        console.error('Error updating permission status:', error);
        res.status(500).json({ message: 'Error updating permission status', error });
    }
};

// Faculty Member checking their permission status
export const manageFacultyPermissions = async (req, res) => {
    try {
        const facultyId = req.user.userId;

        // Find all permission requests made by the faculty
        const facultyPermissions = await PermissionRequest.find({
            facultyId,
            expiresAt: { $gte: new Date.now() }
        });

        res.status(200).json({ message: 'Here are your permission requests:', facultyPermissions });
    } catch (error) {
        console.error('Error managing faculty permissions:', error);
        res.status(500).json({ message: 'Error retrieving your permissions', error });
    }
};
