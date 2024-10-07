import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { toast } from 'react-hot-toast';

const BASEURL = 'http://localhost:5000/api';

// Helper function to get the token from cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper function to calculate days remaining until expiration
const calculateDaysRemaining = (expiresAt) => {
  const expirationDate = new Date(expiresAt);
  const currentDate = new Date();
  const diffTime = expirationDate - currentDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

const HODManagingDuty = () => {
  const [duties, setDuties] = useState([]);
  const token = getCookie('token');
  
  useEffect(() => {
    const fetchDuties = async () => {
      if (!token) {
        toast.error('No valid token found');
        return;
      }

      try {
        const response = await fetch(`${BASEURL}/marksManagement/hod/assigned-duties`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch duties');
        }

        const data = await response.json();
        const sortedDuties = data.permissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDuties(sortedDuties); 
        toast.success('Duties fetched successfully');
      } catch (error) {
        console.error('Error fetching duties:', error);
        toast.error(error.message);
      }
    };

    fetchDuties();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-5 text-center">HOD Viewing Panel for Duties</h1>
        {duties.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-gray-600">S. No.</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Faculty Name</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Duty Title</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Duty Assigned</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Expires In</th>
                </tr>
              </thead>
              <tbody>
                {duties.map((duty, index) => (
                  <tr key={duty.id} className="hover:bg-gray-100 transition-colors duration-200">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{duty.facultyName}</td>
                    <td className="py-2 px-4 border-b">{duty.dutyName}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(duty.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span className={`inline-block px-2 py-1 rounded-full text-white ${duty.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {duty.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {calculateDaysRemaining(duty.expiresAt)} days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No duties assigned yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HODManagingDuty;
