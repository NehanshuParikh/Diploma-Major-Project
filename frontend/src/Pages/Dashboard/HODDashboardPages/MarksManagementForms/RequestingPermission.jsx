//  This Page / Component works with SETEXAMTYPESUBJECTBRANCHDIVISION request in backend

import React, { useState } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { toast } from 'react-hot-toast';
import { useLoading } from '../../../../Context/LoadingContext';

const BASEURL = 'http://localhost:5000/api/marksManagement';

const RequestingPermission = () => {
    const [formData, setFormData] = useState({
        examType: '',
        subject: '',
        branch: '',
        level: '',
        school: '',
        division: '',
        semester: '',
        facultyName: ''
    });

    const { setLoading } = useLoading();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No token found. Please log in.');
            setLoading(false);
            return;
        }
    
        const data = {
            examType: formData.examType,
            subject: formData.subject,
            branch: formData.branch,
            level: formData.level,
            school: formData.school,
            division: formData.division,
            semester: formData.semester,
            facultyName: formData.facultyName // Ensure this is included
        };
    
        try {
            const response = await fetch(`${BASEURL}/request-permission`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
    
            const responseData = await response.json();
            setLoading(false);
    
            if (response.ok) {
                toast.success(responseData.message);
            } else {
                toast.error(responseData.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            toast.error('An error occurred');
        }
    };
    

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-800 p-8">
                <h1 className="text-3xl font-bold mb-6 dark:text-white">Request a permission</h1>
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
                        name="facultyName"
                        placeholder="Faculty Name"
                        value={formData.facultyName}
                        onChange={handleChange}
                        className="mb-4 p-2  border-grey-50 text-black border-[.5px] border-slate-500 rounded w-full dark:bg-[#1D2A39] dark:text-white"
                    />
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default RequestingPermission;
