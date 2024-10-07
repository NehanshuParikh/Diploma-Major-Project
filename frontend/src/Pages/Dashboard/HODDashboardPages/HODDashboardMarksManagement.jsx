import React from 'react';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';
import { FaClipboardCheck,FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const HODDashboardMarksManagement = () => {
  const navigate = useNavigate();
  const handleExcelUpload = () => {
    // Navigate to the bulk upload page when the user clicks the div
    navigate('/api/dashboard/marks-management/addmarks/inbulk');
  };
  const handleManualUpload = ()=>{
    navigate('/api/dashboard/marks-management/addmarks/manually');
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-5 justify-center items-center mt-10">
        {/* Manual Entry Option */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-10 rounded-lg shadow-lg w-full md:w-1/2 text-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={handleManualUpload}>
        <div className="flex justify-center items-center mb-3">
            {/* Excel Icon */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <FaClipboardCheck className='inline-block text-3xl text-purple-500' />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">Enter Marks Manually</h2>
          <p className="text-lg">Input marks for each student individually</p>
        </div>

        {/* Upload via Excel Option */}
        <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 p-10 rounded-lg shadow-lg w-full md:w-1/2 text-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={handleExcelUpload}>
          <div className="flex justify-center items-center mb-3">
            {/* Excel Icon */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-500 text-2xl font-bold"><FaFileExcel /></span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Upload via Excel</h2>
          <p className="text-lg">Upload student marks using an Excel sheet</p>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default HODDashboardMarksManagement;
