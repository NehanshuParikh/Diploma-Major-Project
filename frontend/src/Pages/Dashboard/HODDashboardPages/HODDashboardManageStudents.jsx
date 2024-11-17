import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';

const HODDashboardManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user/get-all-students', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.success) {
                    setStudents(data.students); // Save fetched students in state
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false); // Turn off loading state after fetching
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div>Loading...</div>
            </DashboardLayout>

        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-screen min-h-screen max-h-screen overflow-hidden">
                <h1 className='text-lg font-bold'>Manage Students:</h1>
                {students.length > 0 ? (
                    <div className="overflow-x-auto mt-6"> {/* Make this div scrollable */}
                        <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'center' }} className='bg-gray-50 rounded-t-lg border-black shadow-lg shadow-gray-400'>
                            <thead className='border-b-2'>
                                <tr className='p-32'>
                                    <th>Sr. No.</th>
                                    <th>Profile Photo</th>
                                    <th>Enrollement ID</th>
                                    <th>Full Name</th>
                                    <th>Level</th>
                                    <th>Branch</th>
                                    <th>School</th>
                                    <th>Contact</th>
                                    <th>Semester</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student._id} className='hover:bg-gray-200 transition-colors cursor-pointer'>
                                        <td>{index + 1}</td> {/* Serial number */}
                                        <td className='flex items-center justify-center'>
                                            <img
                                                src={student.profilePhoto}
                                                alt={`${student.fullName}'s profile`}
                                                width="80"
                                                height="80"
                                                className='object-cover w-20 h-20'
                                            />
                                        </td>
                                        <td>{student.enrollmentId}</td>
                                        <td>{student.fullName}</td>
                                        <td>{student.level}</td>
                                        <td>{student.branch}</td>
                                        <td>{student.school}</td>
                                        <td>{student.mobile}</td>
                                        <td>{student.semester}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No students found for your branch and school.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default HODDashboardManageStudents;
