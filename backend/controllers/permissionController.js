import { Permission } from '../models/permissionModel.js';
import { Marks } from '../models/marksModel.js';  // Assuming you have this already
import { User } from '../models/userModel.js';

export const assignDuty = async (req, res) => {
    try {
        const {
            facultyIdOrFullName,
            subject,
            examType,
            branch,
            semester,
            division,
            school,
            level
        } = req.body;

        const hodId = req.user.id;  // HOD's ID from token

        let faculty;
        const cleanedInput = facultyIdOrFullName.trim();  // Clean the input

        // Check if the input is a userId or fullName
        if (/^[\w-]+$/.test(cleanedInput)) {
            faculty = await User.findOne({ userId: cleanedInput });
        } else {
            faculty = await User.findOne({ fullname: new RegExp(`^${cleanedInput}$`, 'i') });
        }

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Normalize fields to lowercase
        const normalizedSubject = subject.trim().toLowerCase();
        const normalizedExamType = examType.trim().toLowerCase();
        const normalizedBranch = branch.trim().toLowerCase();
        const normalizedSchool = school.trim().toLowerCase();
        const normalizedLevel = level.trim().toLowerCase();
        const normalizedDivision = division.trim();
        const normalizedSemester = semester.trim();

        const existingPermission = await Permission.findOne({
            facultyId: faculty.userId,
            subject: normalizedSubject,
            examType: normalizedExamType,
            semester: normalizedSemester,
            branch: normalizedBranch,
            division: normalizedDivision,
            level: normalizedLevel,
            school: normalizedSchool,
        });

        if (existingPermission) {
            return res.status(400).json({ message: 'This duty has already been assigned to the faculty' });
        }

        // Set expiresAt to 15 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 15);

        const newPermission = new Permission({
            hodId,
            facultyId: faculty.userId,
            facultyName: faculty.fullname,
            subject: normalizedSubject,
            examType: normalizedExamType,
            branch: normalizedBranch,
            semester: normalizedSemester,
            division: normalizedDivision,
            school: normalizedSchool,
            level: normalizedLevel,
            dutyName: `${normalizedExamType}-${normalizedLevel}-${normalizedBranch}-${normalizedSchool}-${normalizedSubject}`,
            status: 'Pending',
            expiresAt,  // Set the expiration date
        });

        await newPermission.save();

        res.status(201).json({ message: 'Duty assigned successfully', permission: newPermission });
    } catch (error) {
        console.error('Error assigning duty:', error);
        res.status(500).json({ message: 'Error assigning duty', error });
    }
};

// Update the status of permission when marks are entered
export const updatePermissionStatus = async (facultyId, subject, examType, semester) => {
    try {
        // Update permission to "Completed"
        await Permission.findOneAndUpdate(
            { facultyId, subject, examType, semester },
            { status: 'Completed', marksSubmitted: true },
            { new: true }
        );
    } catch (error) {
        console.error('Error updating permission status:', error);
    }
};

export const viewAssignedDuties = async (req, res) => {
    try {
        const hodId = req.user.id;

        // Fetch permissions for the HOD
        const permissions = await Permission.find({ hodId });

        // Retrieve faculty details for each permission
        const facultyIds = permissions.map(permission => permission.facultyId); // Get all facultyIds
        const faculties = await User.find({ userId: { $in: facultyIds } }); // Find all faculty members based on userId

        // Create a mapping of facultyId to user details
        const facultyMap = faculties.reduce((acc, faculty) => {
            acc[faculty.userId] = faculty;
            return acc;
        }, {});

        // Combine permissions with faculty details
        const detailedPermissions = permissions.map(permission => ({
            ...permission.toObject(), // Convert to plain object
            faculty: facultyMap[permission.facultyId] || null // Attach faculty details
        }));

        res.status(200).json({ message: 'Permissions fetched successfully', permissions: detailedPermissions });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ message: 'Error fetching permissions', error });
    }
};

// View duties for Faculty (all permissions assigned to them)
export const viewFacultyDuties = async (req, res) => {
    try {
        const facultyId = req.user.userId; // Assuming facultyId is stored in the token

        // Fetch permissions for the faculty using facultyId directly from the Permission model
        const permissions = await Permission.find({ facultyId }) // Match permissions by facultyId
            .populate('hodId', 'fullname email'); // Populate HOD details

        // Check if permissions are found
        if (permissions.length === 0) {
            return res.status(404).json({ message: 'No duties assigned to this faculty.' });
        }

        // Create detailed permissions array
        const detailedPermissions = permissions.map(permission => ({
            ...permission.toObject(), // Convert to plain object
            hodId: permission.hodId, // Include HOD details
        }));

        res.status(200).json({ message: 'Duties fetched successfully', permissions: detailedPermissions });
    } catch (error) {
        console.error('Error fetching duties:', error);
        res.status(500).json({ message: 'Error fetching duties', error });
    }
};

