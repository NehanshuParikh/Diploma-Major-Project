import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../Components/DashboardComponents/DashboardLayout';
import toast from 'react-hot-toast'; // Importing toast from react-hot-toast

const UnitViewing = () => {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        const getAllTheUnits = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/units/view-units', {
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET'
                });

                const data = await response.json();
                console.log(data);
                
                // Check if the success property exists and units array is defined
                if (data.success && Array.isArray(data.units)) {
                    if (data.units.length > 0) {
                        setUnits(data.units);
                        toast.success("All Units Found");
                    } else {
                        // Show toast notification for no units found
                        toast.success("No Units Found");
                    }
                } else {
                    // Handle case where the success property is false
                    toast.success(data.message || "Failed to fetch units");
                }
            } catch (error) {
                console.error('Error fetching units:', error);
                toast.error("Failed to fetch units");
            }
        };

        getAllTheUnits();      
    }, []);

    return (
        <>
            <DashboardLayout>
                <div className="container mx-auto p-4">
                    <h1 className="text-xl font-semibold mb-4">Units Viewing Panel</h1>
                    
                    {units.length === 0 ? (
                        <div className="text-center text-lg text-red-500">No Units Found</div>
                    ) : (
                        <div className="overflow-x-auto"> {/* Added div for horizontal scrolling */}
                            <table className="min-w-full border border-gray-300 text-center ">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border px-4 py-2">S.No</th> {/* Added Serial Number Header */}
                                        <th className="border px-4 py-2">HOD Name</th>
                                        <th className="border px-4 py-2">Faculty Name</th>
                                        <th className="border px-4 py-2">Subject ID</th>
                                        <th className="border px-4 py-2">Subject Name</th>
                                        <th className="border px-4 py-2">Level</th>
                                        <th className="border px-4 py-2">Branch</th>
                                        <th className="border px-4 py-2">School</th>
                                        <th className="border px-4 py-2">Semester</th>
                                        <th className="border px-4 py-2">Division</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map((unit, index) => (
                                        <tr key={unit._id}>
                                            <td className="border px-4 py-2">{index + 1}</td> {/* Serial Number */}
                                            <td className="border px-4 py-2">{unit.hod.fullName}</td>
                                            <td className="border px-4 py-2">{unit.faculty.fullName || "N/A"}</td>
                                            <td className="border px-4 py-2">{unit.subject.code}</td>
                                            <td className="border px-4 py-2">{unit.subject.name || "N/A"}</td>
                                            <td className="border px-4 py-2">{unit.Level}</td>
                                            <td className="border px-4 py-2">{unit.Branch}</td>
                                            <td className="border px-4 py-2">{unit.School}</td>
                                            <td className="border px-4 py-2">{unit.Semester}</td>
                                            <td className="border px-4 py-2">{unit.Division}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export default UnitViewing;
