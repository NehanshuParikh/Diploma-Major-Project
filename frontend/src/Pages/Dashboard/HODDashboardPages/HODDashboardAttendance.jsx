import React from 'react';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';
import { FaClipboardCheck, FaUserCheck } from 'react-icons/fa'; // You can choose appropriate icons
import { useNavigate } from 'react-router';

const HODDashboardAttendance = () => {
  const navigate = useNavigate();

  const handleTakeAttendance = () => {
    navigate('/api/dashboard/attendance/take/normal-attendance'); // Update the path as necessary
  };

  const handleProxyManagement = () => {
    navigate('/api/dashboard/attendance/take/proxy-attendance'); // Update the path as necessary
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-5 justify-center items-center mt-10">
        {/* Take Attendance Option */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-10 rounded-lg shadow-lg w-full md:w-1/2 text-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={handleTakeAttendance}>
          <div className="flex justify-center items-center mb-3">
            {/* Attendance Icon */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <FaClipboardCheck className='inline-block text-3xl text-blue-600' />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Take Your Attendance</h2>
          <p className="text-lg">Record attendance for your students effortlessly</p>
        </div>

        {/* Proxy Management Option */}
        <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 p-10 rounded-lg shadow-lg w-full md:w-1/2 text-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={handleProxyManagement}>
          <div className="flex justify-center items-center mb-3">
            {/* Proxy Icon */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <FaUserCheck className='inline-block text-3xl text-orange-500' />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Manage Proxy Attendance</h2>
          <p className="text-lg">Record and verify proxy attendance seamlessly</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default HODDashboardAttendance;
