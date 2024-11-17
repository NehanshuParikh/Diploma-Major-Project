import React, { useState } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { toast } from 'react-hot-toast';
import { useLoading } from '../../../../Context/LoadingContext';

const BASEURL = 'http://localhost:5000/api/marksManagement';
const USER_SEARCH_URL = 'http://localhost:5000/api/user/search'; // Ensure this is the correct endpoint

const AssigningDuty = () => {
    const [formData, setFormData] = useState({
        examType: '',
        subject: '',
        branch: '',
        level: '',
        school: '',
        division: Number,
        semester: Number,
        facultyNameOrId: '' // Field to handle faculty name or ID
    });

    const [suggestions, setSuggestions] = useState([]); // To store user suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { setLoading } = useLoading();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Fetch suggestions when typing in the faculty input
        if (e.target.name === "facultyNameOrId" && e.target.value.length > 1) {
            fetchSuggestions(e.target.value);
        } else {
            setShowSuggestions(false); // Hide suggestions when input is less than 2 characters
        }
    };

    const fetchSuggestions = async (query) => {
        const token = localStorage.getItem('token'); // Get the token at the beginning

        try {
            const response = await fetch(`${USER_SEARCH_URL}?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Filter out student user types
                    const filteredUsers = data.users.filter(user => user.userType !== 'student');
                    setSuggestions(filteredUsers); // Set filtered users or empty array
                    setShowSuggestions(true); // Show the suggestions
                } else {
                    setSuggestions([]); // No success, no suggestions
                    setShowSuggestions(true); // Still show empty suggestions
                }
            } else {
                console.error('Error fetching suggestions:', response.statusText);
                setSuggestions([]); // Error means no suggestions
                setShowSuggestions(true); // Still show empty suggestions
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]); // If error, no suggestions
            setShowSuggestions(true); // Still show empty suggestions
        }
    };

    const handleSelectSuggestion = (faculty) => {
        setFormData({ ...formData, facultyNameOrId: faculty.userId });
        setShowSuggestions(false); // Hide suggestions after selection
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
            facultyIdOrFullName: formData.facultyNameOrId // Send either faculty name or ID
        };

        try {
            const response = await fetch(`${BASEURL}/assign-duty`, {
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
                setFormData({
                    examType: '',
                    subject: '',
                    branch: '',
                    level: '',
                    school: '',
                    division: '',
                    semester: '',
                    facultyNameOrId: ''
                });
                setSuggestions([]); // Clear suggestions after successful submission
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
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Assign Duty to Faculty</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Exam Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Exam Type</label>
                        <select
                            name="examType"
                            value={formData.examType}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select Exam Type</option>
                            <option value="Mid-Sem-1">Mid-Sem-1</option>
                            <option value="Mid-Sem-2">Mid-Sem-2</option>
                            <option value="External">External</option>
                        </select>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter Subject"
                            required
                        />
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Branch</label>
                        <input
                            type="text"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter Branch"
                            required
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Level</label>
                        <input
                            type="text"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter Level"
                            required
                        />
                    </div>

                    {/* School */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">School</label>
                        <input
                            type="text"
                            name="school"
                            value={formData.school}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter School"
                            required
                        />
                    </div>

                    {/* Division */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Division</label>
                        <input
                            type="number"
                            name="division"
                            value={formData.division}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter Division"
                            required
                        />
                    </div>

                    {/* Semester */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Semester</label>
                        <input
                            type="number"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter Semester"
                            required
                        />
                    </div>

                    {/* Faculty Name or ID with auto-suggestion */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Faculty Name or ID</label>
                        <input
                            type="text"
                            name="facultyNameOrId"
                            value={formData.facultyNameOrId}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter Faculty Name or ID"
                            required
                        />
                        {showSuggestions && (
                            <ul className="border border-gray-300 rounded-md mt-2">
                                {/* Check if there are suggestions */}
                                {suggestions.length > 0 ? (
                                    suggestions.map((faculty) => (
                                        <li
                                            key={faculty._id}
                                            className="p-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => handleSelectSuggestion(faculty)}
                                        >
                                            {faculty.fullName} ({faculty.userId})
                                        </li>
                                    ))
                                ) : (
                                    // Display 'No match found' if no suggestions are available
                                    <li className="p-2 text-gray-500">No match found</li>
                                )}
                            </ul>
                        )}
                    </div>


                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Assign Duty
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default AssigningDuty;
