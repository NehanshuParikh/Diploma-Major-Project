//  This Page / Component works with UPLOADMARKSINBULK request in backend

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
        file: ''
    });

    const { setLoading } = useLoading();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        // Store the file directly in the formData state
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Retrieve token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No token found. Please log in.');
            setLoading(false);
            return;
        }

        // Create a FormData object
        const data = new FormData();
        data.append('examType', formData.examType);
        data.append('subject', formData.subject);
        data.append('branch', formData.branch);
        data.append('level', formData.level);
        data.append('school', formData.school);
        data.append('division', formData.division);
        data.append('semester', formData.semester);
        data.append('file', formData.file); // Append the file

        try {
            const response = await fetch(`${BASEURL}/uploadMarksSheet`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include token in Authorization header
                },
                credentials: 'include', // Include cookies if required
                body: data, // Send FormData (not JSON)
            });

            const responseData = await response.json();
            setLoading(false);

            if (response.ok) {
                toast.success(responseData.message);
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
                <form onSubmit={handleSubmit} className="bg-white border-[.5px] border-slate-100 dark:bg-gray-800 dark:border-slate-700 w-full p-4 lg:w-2/3 lg:p-12 rounded shadow-md shadow-2xl">
                    <select name="examType" id="examType" onChange={handleChange}
                        className="mb-4 p-2 border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white">
                        <option value="Default" defaultChecked>Select Exam Type</option>
                        <option value="Mid-1">Mid-1</option>
                        <option value="Mid-2">Mid-2</option>
                        <option value="External">External</option>
                    </select>
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="mb-4 p-2  border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                    />
                    <input
                        type="text"
                        name="branch"
                        placeholder="Branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="mb-4 p-2  border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                    />
                    <input
                        type="text"
                        name="level"
                        placeholder="Level (Eg: Diploma, Degree, Masters)"
                        value={formData.level}
                        onChange={handleChange}
                        className="mb-4 p-2  border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                    />
                    <input
                        type="text"
                        name="school"
                        placeholder="School"
                        value={formData.school}
                        onChange={handleChange}
                        className="mb-4 p-2  border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                    />
                    <input
                        type="text"
                        name="division"
                        placeholder="Division"
                        value={formData.division}
                        onChange={handleChange}
                        className="mb-4 p-2  border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                    />
                    <input
                        type="text"
                        name="semester"
                        placeholder="Semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="mb-4 p-2  border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                    />
                    <input
                        type="file"
                        name="file"
                        onChange={handleFileChange} // Use handleFileChange to capture the file
                        className="mb-4 p-2  border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                    />
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
