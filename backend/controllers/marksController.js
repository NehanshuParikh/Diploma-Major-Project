import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs'; // Import fs module
import path from 'path'; // Import path module
import { Marks } from '../models/marksModel.js';

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

    // Set cookies with the selected exam type and subject
    res.cookie('examType', examType, { httpOnly: true });
    res.cookie('subject', subject, { httpOnly: true });
    res.cookie('branch', branch, { httpOnly: true });
    res.cookie('division', division, { httpOnly: true });
    res.cookie('level', level, { httpOnly: true });
    res.cookie('school', school, { httpOnly: true });
    res.cookie('semester', semester, { httpOnly: true });

    res.status(200).json({ message: 'Exam type and subject selected' });
}

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

    if (!examType || !subject) {
        return res.status(400).json({ message: 'Exam type or subject not selected' });
    }

    // Create a new marks entry
    const marksEntry = new Marks({
        marksId: `${studentId}-Sem-${semester}-${subject}-${examType}-${level}-${branch}-${school}`, // Example: student123-Mid-Sem-1-Python
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

    try {
        await marksEntry.save();
        res.status(201).json({ message: 'Marks entered successfully', marksEntry });
    } catch (error) {
        res.status(500).json({ message: 'Error entering marks', error });
    }
};

export const uploadMarksSheet = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Read the Excel file
        const workbook = xlsx.readFile(file.path);
        
        // Loop through all sheets in the workbook
        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            // Process the data for each sheet
            for (const row of data) {
                const { studentId, marks, examType, subject, level, branch, division, school, semester } = row;

                // Create a new marks entry
                const marksEntry = new Marks({
                    marksId: `${studentId}-Sem-${semester}-${subject}-${examType}-${level}-${branch}-${school}`, // Example: student123-Mid-Sem-1-Python
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
            }
        }

        // Delete the file after processing
        fs.unlinkSync(file.path);

        res.status(200).json({ message: 'Marks uploaded successfully' });
    } catch (error) {
        console.error('Error uploading marks in bulk:', error);
        res.status(500).json({ message: 'Error uploading marks in bulk', error });
    }
};
