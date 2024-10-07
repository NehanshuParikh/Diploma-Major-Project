import React, { useState } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { toast } from 'react-hot-toast';
import { useLoading } from '../../../../Context/LoadingContext';

const BASEURL = 'http://localhost:5000/api/marksManagement';

const MarksInBulkForm = () => {
    const [formData, setFormData] = useState({
        examType: '',
        subject: '',
        branch: '',
        level: '',
        school: '',
        division: '',
        semester: '',
        file: null
    });

    const { setLoading } = useLoading();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        // Store the file directly in the formData state
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const getCookie = (cookieName) => {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie); // Decodes the cookie if it contains special characters
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null; // Return null if the cookie is not found
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Get the token from cookies
        const token = getCookie('token'); // Assuming the token is stored in a cookie named 'token'

        if (!token) {
            toast.error('No token found. Please log in.');
            setLoading(false);
            return;
        }

        // Normalize form data to match the backend's expected format
        const data = new FormData();
        data.append('examType', formData.examType.trim().toLowerCase());
        data.append('subject', formData.subject.trim().toLowerCase());
        data.append('branch', formData.branch.trim().toLowerCase());
        data.append('level', formData.level.trim().toLowerCase());
        data.append('school', formData.school.trim().toLowerCase());
        data.append('division', formData.division.trim());
        data.append('semester', formData.semester.trim());
        data.append('file', formData.file); // Append the file

        try {
            const response = await fetch(`${BASEURL}/uploadMarksSheet`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in Authorization header
                },
                body: data, // Send FormData (not JSON)
                credentials: 'include' // To include cookies in requests if needed
            });

            const responseData = await response.json();
            setLoading(false);

            if (response.ok) {
                toast.success(responseData.message);
                // Reset form after successful upload
                setFormData({
                    examType: '',
                    subject: '',
                    branch: '',
                    level: '',
                    school: '',
                    division: '',
                    semester: '',
                    file: null
                });
            } else {
                toast.error(responseData.message || 'File upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setLoading(false);
            toast.error('An error occurred while uploading the file');
        }
    };


    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-800 p-8">
                <h1 className="text-3xl font-bold mb-6 dark:text-white">Upload Marks in Bulk</h1>
                <form onSubmit={handleSubmit} className="bg-white border dark:bg-gray-800 dark:border-slate-700 w-full p-4 lg:w-2/3 lg:p-12 rounded shadow-md shadow-2xl">
                    {/* Exam Type */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Exam Type</label>
                        <select
                            name="examType"
                            value={formData.examType}
                            onChange={handleChange}
                            className="mt-1 p-2 border text-black border-gray-300 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                            required
                        >
                            <option value="">Select Exam Type</option>
                            <option value="mid-sem-1">mid-sem-1</option>
                            <option value="mid-sem-2">mid-sem-2</option>
                            <option value="external">external</option>
                        </select>

                    </div>

                    {/* Subject */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="mt-1 p-2 border text-black border-gray-300 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                            required
                        />
                    </div>

                    {/* Branch */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Branch</label>
                        <input
                            type="text"
                            name="branch"
                            placeholder="Branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="mt-1 p-2 border text-black border-gray-300 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                            required
                        />
                    </div>

                    {/* Level */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Level</label>
                        <input
                            type="text"
                            name="level"
                            placeholder="Level (e.g., Diploma, Degree, Masters)"
                            value={formData.level}
                            onChange={handleChange}
                            className="mt-1 p-2 border text-black border-gray-300 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                            required
                        />
                    </div>

                    {/* School */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">School</label>
                        <input
                            type="text"
                            name="school"
                            placeholder="School"
                            value={formData.school}
                            onChange={handleChange}
                            className="mt-1 p-2 border text-black border-gray-300 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                            required
                        />
                    </div>

                    {/* Division */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Division</label>
                        <input
                            type="text"
                            name="division"
                            placeholder="Division"
                            value={formData.division}
                            onChange={handleChange}
                            className="mt-1 p-2 border text-black border-gray-300 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                            required
                        />
                    </div>

                    {/* Semester */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Semester</label>
                        <input
                            type="text"
                            name="semester"
                            placeholder="Semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="mt-1 p-2 border text-black border-gray-300 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                            required
                        />
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Upload Excel File</label>
                        <input
                            type="file"
                            name="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="mt-1 p-2 border text-black border-gray-300 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
                    >
                        Upload Marks
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default MarksInBulkForm;
