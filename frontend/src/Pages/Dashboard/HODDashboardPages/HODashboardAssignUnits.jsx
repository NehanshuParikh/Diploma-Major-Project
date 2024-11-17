import React, { useState } from 'react';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';
import toast from 'react-hot-toast'


const FORM_SUBMISSION_URL = 'http://localhost:5000/api/units/assign-units';
const USER_SEARCH_URL = 'http://localhost:5000/api/user/search'; // Ensure this is the correct endpoint
const SUBJECT_SEARCH_URL = 'http://localhost:5000/api/user/search-subject'; // Ensure this is the correct endpoint


const HODashboardAssignUnits = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [subjectSuggestions, setSubjectSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showSubjectSuggestions, setSubjectShowSuggestions] = useState(false);
    const [formData, setFormData] = useState({
        facultyIdOrName: '',
        level: '',
        branch: '',
        school: '',
        semester: '',
        subjectCodeOrName: '',
        division: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Fetch suggestions when typing in the faculty input
        if (e.target.name === "facultyIdOrName" && e.target.value.length > 1) {
            fetchSuggestions(e.target.value);
        } else if (e.target.name === "subjectCodeOrName" && e.target.value.length > 1) {
            fetchSubjectSuggestions(e.target.value);
        } {
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

    const fetchSubjectSuggestions = async (query) => {
        const token = localStorage.getItem('token'); // Get the token at the beginning
        try {
            const response = await fetch(`${SUBJECT_SEARCH_URL}?query=${query}`, {
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
                    setSubjectSuggestions(data.subjects); // Make sure 'subjects' is the correct field from API response
                    setSubjectShowSuggestions(true); // Show the suggestions
                } else {
                    setSubjectSuggestions([]); // No success, no suggestions
                    setSubjectShowSuggestions(true); // Still show empty suggestions
                }
            } else {
                console.error('Error fetching subject suggestions:', response.statusText);
                setSubjectSuggestions([]); // Error means no suggestions
                setSubjectShowSuggestions(true); // Still show empty suggestions
            }
        } catch (error) {
            console.error('Error fetching subject suggestions:', error);
            setSubjectSuggestions([]); // If error, no suggestions
            setSubjectShowSuggestions(true); // Still show empty suggestions
        }
    };



    const handleSelectSuggestion = (faculty) => {
        setFormData({ ...formData, facultyIdOrName: faculty.userId });
        setShowSuggestions(false); // Hide suggestions after selection
    };

    const handleSelectSubjectSuggestion = (subject) => {
        setFormData({ ...formData, subjectCodeOrName: subject.SubjectCode });
        setSubjectShowSuggestions(false); // Hide suggestions after selection
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${FORM_SUBMISSION_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    FacultyUserId: formData.facultyIdOrName,
                    Level: formData.level,
                    Branch: formData.branch,
                    School: formData.school,
                    Semester: formData.semester,
                    SubjectFromRequest: formData.subjectCodeOrName, // Update here
                    Division: formData.division
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Unit Created & Allocated Successfully');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error('Something went wrong');
        }
    };



    return (
        <DashboardLayout>
            <div className="p-6">
                <div className=" w-full flex flex-col items-center">
                    <form onSubmit={handleSubmit} className="space-y-4 w-full lg:w-3/4 p-8 bg-white rounded-lg shadow-lg shadow-gray-500">
                        <h1 className="text-2xl font-bold mb-4 text-center">Assign Unit</h1>
                        {/* Faculty Name or ID with auto-suggestion */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Faculty Name or ID</label>
                            <input
                                type="text"
                                name="facultyIdOrName"
                                value={formData.facultyIdOrName}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
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
                        <div className="w-full flex items-center gap-4">
                            {/* Level */}
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">Level</label>
                                <input
                                    type="text"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter Level"
                                    required
                                />
                            </div>

                            {/* Branch */}
                            <div className='w-full'>
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
                        </div>

                        <div className="w-full flex items-center gap-4 flex-col lg:flex-row">
                            {/* School */}
                            <div className="w-full">
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

                            {/* Semester */}
                            <div className="w-full">
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

                            {/* Division */}
                            <div className="w-full">
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
                        </div>

                        {/* Subject Code or Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject Code or Name</label>
                            <input
                                type="text"
                                name="subjectCodeOrName"
                                value={formData.subjectCodeOrName}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter Subject Code or Name"
                                required
                            />
                            {showSubjectSuggestions && (
                                <ul className="border border-gray-300 rounded-md mt-2">
                                    {/* Check if there are suggestions */}
                                    {subjectSuggestions.length > 0 ? (
                                        subjectSuggestions.map((subject) => (
                                            <li
                                                key={subject._id}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => handleSelectSubjectSuggestion(subject)}
                                            >
                                                {subject.SubjectName} ({subject.SubjectCode})
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
                                Assign Unit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HODashboardAssignUnits;
