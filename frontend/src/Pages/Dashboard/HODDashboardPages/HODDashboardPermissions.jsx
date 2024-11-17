// src/Pages/HODDashboardPermissions.js
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';
import { FaTasks, FaListAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const BASEURL = 'http://localhost:5000'


const HODDashboardPermissions = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); // Store userType
  const [loading, setLoading] = useState(true);   // Loading state for async data

  // Fetch logged-in user info using fetch
  const fetchUserData = async () => {
    try {
      // Fetch user info from API
      const response = await fetch(`${BASEURL}/api/user/user-info`, {
        method: 'GET',
        credentials: 'include',  // Ensures cookies (like JWT) are sent with the request
      });

      // Log the full response for debugging
      console.log('Response:', response);

      // Check content type to ensure it's JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON but got ${contentType}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();  // Parse JSON response
      console.log('User Data:', userData);  // Debug: Log the fetched user data
      setUserType(userData.userType);  // Set the userType (e.g., 'HOD', 'Faculty')
      setLoading(false);  // Stop loading once data is fetched
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);  // Stop loading on error as well
    }
  };

  useEffect(() => {
    fetchUserData();  // Call the function to fetch user data when the component mounts
  }, []);

  // Handle Allocate Duty
  const handleAllocateDuty = () => {
    navigate('/api/dashboard/marks-management/permissions/assign-duty');
  };

  // Handle Manage Duty
  const handleManageDuty = () => {
    if (userType === 'Faculty') {
      navigate('/api/dashboard/marks-management/permissions/Faculty-viewing-panel');
    } else {
      navigate('/api/dashboard/marks-management/permissions/HOD-viewing-panel');
    }
  };

  // Show loading while fetching the data
  if (loading) {
    return (
        <DashboardLayout>
            <div>Loading...</div>
        </DashboardLayout>

    )
}

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-5 justify-center items-center mt-10">
        {/* Render UI elements based on userType */}
        {userType === 'HOD' && (
          <>
            {/* Allocate Duty Option (Visible only for HOD) */}
            <div
              className="bg-gradient-to-r from-indigo-400 via-cyan-500 to-teal-500 p-10 rounded-lg shadow-lg w-full md:w-1/2 text-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={handleAllocateDuty}
            >
              <div className="flex justify-center items-center mb-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <FaTasks className="inline-block text-3xl text-teal-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">Allocate The Duty</h2>
              <p className="text-lg">Assign duties to faculty members with ease</p>
            </div>
          </>
        )}

        {/* Manage Duty Option (Visible for both Faculty and HOD) */}
        {(userType === 'HOD' || userType === 'Faculty') && (
          <div
            className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 p-10 rounded-lg shadow-lg w-full md:w-1/2 text-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={handleManageDuty}
          >
            <div className="flex justify-center items-center mb-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <FaListAlt className="text-red-500 text-3xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Manage The Duties</h2>
            <p className="text-lg">One place to view and manage all duties</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HODDashboardPermissions;
