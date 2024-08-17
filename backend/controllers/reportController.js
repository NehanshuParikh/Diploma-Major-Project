import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { User } from '../models/userModel.js';
import { Marks } from '../models/marksModel.js';
import { readFile } from 'fs/promises';
import path from 'path';
import pdf from 'html-pdf';
import { createCanvas } from 'canvas'; // Importing the createCanvas function
import Chart from 'chart.js/auto'; // Importing Chart.js
import { readFileSync } from 'fs';

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the template path
const templatePath = path.join(__dirname, '../templates/reportTemplate.html');



// Convert image to Base64
const imagePath = path.join(__dirname, '../uploads/images/profile-placeholder.png');
const imageBase64 = readFileSync(imagePath).toString('base64');
const imageSrc = `data:image/png;base64,${imageBase64}`;



export const generateStudentReport = async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery || req.body.searchQuery;

        if (!searchQuery) {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const user = await User.findOne({
            $or: [
                { userId: searchQuery },
                { fullname: new RegExp(searchQuery, 'i') }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const marks = await Marks.find({ studentId: user.userId }).sort({ examType: 1, semester: 1 });

        // Prepare HTML content with dynamic data
        let templateContent = await readFile(templatePath, 'utf8');

        // Replace placeholders with actual data
        templateContent = templateContent
            .replace('{{name}}', user.fullname)
            .replace('{{userId}}', user.userId)
            .replace('{{email}}', user.email)
            .replace('{{path}}', imageSrc)
            .replace('{{mobile}}', user.mobile || 'Not provided');

        // Group marks by exam type and semester
        const groupedMarks = marks.reduce((acc, mark) => {
            const examTypeFormatted = mark.examType.replace(/-/g, ' '); // Format examType for easier comparison
            if (!acc[examTypeFormatted]) acc[examTypeFormatted] = {};
            if (!acc[examTypeFormatted][mark.semester]) acc[examTypeFormatted][mark.semester] = [];
            acc[examTypeFormatted][mark.semester].push(mark);
            return acc;
        }, {});

        const createTableAndChart = async (examType) => {
            let tableRows = '';
            let chartImages = '';

            // Check if there are marks for the given exam type
            if (groupedMarks[examType]) {
                for (const semester in groupedMarks[examType]) {
                    const canvas = createCanvas(600, 400); // Create a canvas
                    const ctx = canvas.getContext('2d');

                    const chartData = {
                        labels: groupedMarks[examType][semester].map(m => m.subject),
                        datasets: [
                            {
                                label: `Marks for ${examType} Semester ${semester}`,
                                data: groupedMarks[examType][semester].map(m => m.marks),
                                backgroundColor: 'rgba(0, 204, 255, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }
                        ]
                    };

                    const chartConfig = {
                        type: 'bar',
                        data: chartData,
                    };

                    new Chart(ctx, chartConfig);
                    const imageBuffer = canvas.toBuffer('image/png'); // Generate an image from the chart
                    const chartImage = `data:image/png;base64,${imageBuffer.toString('base64')}`;

                    tableRows += `
                        <h2>Semester ${semester} ${examType} Marks</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Semester</th>
                                    <th>Exam Type</th>
                                    <th>Subject</th>
                                    <th>Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${groupedMarks[examType][semester].map(mark => `
                                    <tr>
                                        <td>${mark.semester}</td>
                                        <td>${mark.examType}</td>
                                        <td>${mark.subject}</td>
                                        <td>${mark.marks}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div class="chart-container">
                            <h2>Semester ${semester} ${examType} Performance</h2>
                            <img src="${chartImage}" alt="Chart">
                        </div>
                    `;
                }
            }

            return tableRows;
        };

        // Create tables and charts for each exam type
        const midSem1TableAndChart = await createTableAndChart('Mid Sem 1');
        const midSem2TableAndChart = await createTableAndChart('Mid Sem 2');
        const externalTableAndChart = await createTableAndChart('External');

        templateContent = templateContent
            .replace('{{midSem1Table}}', midSem1TableAndChart || '<p>No data available for Mid Sem 1.</p>')
            .replace('{{midSem2Table}}', midSem2TableAndChart || '<p>No data available for Mid Sem 2.</p>')
            .replace('{{externalTable}}', externalTableAndChart || '<p>No data available for External.</p>');

        // Generate the PDF using html-pdf
        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
        };

        pdf.create(templateContent, options).toStream((err, stream) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error generating PDF' });
            }
            const fileName = `Report_${user.userId}.pdf`;
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-type', 'application/pdf');
            stream.pipe(res);
        });

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ success: false, message: 'Error generating report' });
    }
};



export const viewStudentReportSheet = async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery || req.body.searchQuery;
        const examTypeFilter = req.query.examType || req.body.examType;
        const semesterFilter = req.query.semester || req.body.semester;

        if (!searchQuery) {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const user = await User.findOne({
            $or: [
                { userId: searchQuery },
                { fullname: new RegExp(searchQuery, 'i') }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const query = { studentId: user.userId };

        if (examTypeFilter) {
            query.examType = examTypeFilter;
        }

        if (semesterFilter) {
            query.semester = semesterFilter;
        }

        const marks = await Marks.find(query).sort({ semester: 1, examType: 1 });

        if (marks.length === 0) {
            return res.status(404).json({ success: false, message: 'No marks data found' });
        }

        const reportData = {
            studentDetails: {
                name: user.fullname,
                enrollmentNumber: user.userId,
                email: user.email,
                mobile: user.mobile || 'Not provided'
            },
            marksDetails: marks
        };

        return res.status(200).json({ success: true, data: reportData });
    } catch (error) {
        console.error('Error retrieving report:', error);
        return res.status(500).json({ success: false, message: 'Error retrieving report' });
    }
};