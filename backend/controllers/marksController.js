import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs'; // Import fs module
import path from 'path'; // Import path module
import { Marks } from '../models/marksModel.js';
import { Permission } from '../models/permissionModel.js';

// Determine the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads')); // Adjust path as needed
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

export const setExamTypeSubjectBranchDivision = async (req, res) => {
    const { examType, subject, branch, division, level, school, semester } = req.body;
    const userId = req.user.userId; // Getting faculty ID from the logged-in user

    // Ensure all fields are filled
    if (!examType || !subject || !branch || !division || !level || !school || !semester) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the HOD has already granted permission for this exam type and subject
        const permission = await Permission.findOne({
            facultyId: userId,
            examType,
            subject,
            semester,
            branch,
            division,
            level,
            school,
        });

        // If no permission record is found, respond with an error
        if (!permission) {
            return res.status(400).json({ message: 'No permission granted by HOD for this exam type or subject' });
        }

        // Set cookies with the selected exam type and subject details
        res.cookie('examType', examType, { httpOnly: true });
        res.cookie('subject', subject, { httpOnly: true });
        res.cookie('branch', branch, { httpOnly: true });
        res.cookie('division', division, { httpOnly: true });
        res.cookie('level', level, { httpOnly: true });
        res.cookie('school', school, { httpOnly: true });
        res.cookie('semester', semester, { httpOnly: true });

        res.status(200).json({ message: 'Exam type, subject, and details selected successfully' });
    } catch (error) {
        console.error('Error setting exam type and subject:', error);
        res.status(500).json({ message: 'Error setting exam type and subject', error });
    }
};

export const marksEntry = async (req, res) => {
    const { studentId, marks } = req.body;

    // Get exam type and subject from cookies
    const examType = req.cookies.examType;
    const subject = req.cookies.subject;
    const branch = req.cookies.branch;
    const division = req.cookies.division;
    const level = req.cookies.level;
    const school = req.cookies.school;
    const semester = req.cookies.semester;
    const facultyId = req.user.userId; // Get faculty ID from the token

    // Ensure exam type and subject are set
    if (!examType || !subject) {
        return res.status(400).json({ message: 'Exam type or subject not selected' });
    }

    try {
        // Check if there is an existing permission granted by the HOD
        const permission = await Permission.findOne({
            facultyId,
            examType,
            subject,
            semester,
            branch,
            division,
            level,
            school,
        });

        if (!permission) {
            return res.status(403).json({ message: 'No permission found for entering marks' });
        }

        // Create a new marks entry
        const marksEntry = new Marks({
            marksId: `${studentId}-Sem-${semester}-${subject}-${examType}-${level}-${branch}-${school}`,
            studentId,
            marks,
            examType,
            subject,
            level,
            branch,
            division,
            school,
            semester
        });

        await marksEntry.save();

        // Update permission status to "Completed" and set marksSubmitted to true
        await Permission.findOneAndUpdate(
            {
                facultyId,
                examType,
                subject,
                semester,
                branch,
                division,
                level,
                school
            },
            {
                status: 'Completed', // Update status to "Completed"
                marksSubmitted: true  // Set marksSubmitted to true
            },
            { new: true }
        );

        res.status(201).json({ message: 'Marks entered successfully, status updated to Completed', marksEntry });
    } catch (error) {
        console.error('Error entering marks:', error);
        res.status(500).json({ message: 'Error entering marks', error });
    }
};

export const uploadMarksSheet = async (req, res) => {
    try {
        const file = req.file;

        // Normalize the form data to lowercase
        const {
            examType,
            subject,
            branch,
            level,
            school,
            division,
            semester,
        } = req.body;

        const facultyId = req.user.userId; // Get faculty ID from the logged-in user

        // Normalize the fields to lowercase
        const normalizedExamType = examType.trim().toLowerCase();
        const normalizedSubject = subject.trim().toLowerCase();
        const normalizedBranch = branch.trim().toLowerCase();
        const normalizedLevel = level.trim().toLowerCase();
        const normalizedSchool = school.trim().toLowerCase();
        const normalizedDivision = parseInt(division.trim());
        const normalizedSemester = parseInt(semester.trim());

        // Check if the faculty has a corresponding permission
        const permission = await Permission.findOne({
            facultyId,
            examType: normalizedExamType,
            subject: normalizedSubject,
            semester: normalizedSemester,
            branch: normalizedBranch,
            division: normalizedDivision,
            level: normalizedLevel,
            school: normalizedSchool,
        });

        if (!permission) {
            return res.status(403).json({ message: 'You do not have permission to upload the marks' });
        }

        // If no file is uploaded, assume it's individual marks entry via form
        if (!file) {
            if (!studentId || !marks) {
                return res.status(400).json({ message: 'All required parameters are not provided' });
            }

            const marksEntry = new Marks({
                marksId: `${studentId}-Sem-${normalizedSemester}-${normalizedSubject}-${normalizedExamType}-${normalizedLevel}-${normalizedBranch}-${normalizedSchool}`,
                studentId,
                marks,
                examType: normalizedExamType,
                subject: normalizedSubject,
                level: normalizedLevel,
                branch: normalizedBranch,
                division: normalizedDivision,
                school: normalizedSchool,
                semester: normalizedSemester,
            });

            await marksEntry.save();
            await Permission.findByIdAndUpdate(permission._id, { marksSubmitted: true }, { new: true });

            return res.status(201).json({ message: 'Marks entered successfully', marksEntry });
        }

        // If a file is uploaded, process bulk marks upload
        const workbook = xlsx.readFile(file.path);

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            for (const row of data) {
                const { studentId, marks } = row;
                if (!studentId || marks === undefined) {
                    continue;
                }

                const marksEntry = new Marks({
                    marksId: `${studentId}-Sem-${normalizedSemester}-${normalizedSubject}-${normalizedExamType}-${normalizedLevel}-${normalizedBranch}-${normalizedSchool}`,
                    studentId,
                    marks,
                    examType: normalizedExamType,
                    subject: normalizedSubject,
                    level: normalizedLevel,
                    branch: normalizedBranch,
                    division: normalizedDivision,
                    school: normalizedSchool,
                    semester: normalizedSemester,
                });

                await marksEntry.save();
            }
        }

        fs.unlinkSync(file.path);

        await Permission.findByIdAndUpdate(permission._id, { status: 'Completed', marksSubmitted: true }, { new: true });

        res.status(200).json({ message: 'Marks uploaded successfully, permission status updated' });
    } catch (error) {
        console.error('Error uploading marks in bulk or individually:', error);
        res.status(500).json({ message: 'Error uploading marks in bulk or individually', error });
    }
};

