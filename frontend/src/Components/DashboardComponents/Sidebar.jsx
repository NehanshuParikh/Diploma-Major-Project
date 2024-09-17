import React, { useContext, useState } from 'react';
import { FaBook, FaClipboardList, FaChartBar, FaChevronDown, FaChevronUp, FaHome, FaTimes } from 'react-icons/fa';
import placeholderImage from '../../Assets/images/profile_placeholder.png';
import { Link } from 'react-router-dom';
import ProfileContext from '../../Context/ProfileContext'; // Import ProfileContext

const BASEURL = 'http://localhost:5173/api';

const Sidebar = ({ isOpen, toggleSidebar, userType }) => {
  const [isMarksDropdownOpen, setMarksDropdownOpen] = useState(false);
  const { profileData, loading } = useContext(ProfileContext); // Use ProfileContext

  const toggleMarksDropdown = () => {
    setMarksDropdownOpen(!isMarksDropdownOpen);
  };

  return (
    <div
      className={`fixed lg:static top-0 left-0 h-screen w-full z-50 lg:w-80 bg-[#1C2434] dark:bg-[#24303F] transition-transform duration-300 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      {/* Profile Section */}
      <div className="p-4 flex items-start justify-between flex-row text-center relative border-b-[.5px] border-b-slate-700">
        <div className="flex flex-col items-start justify-center">
          {loading ? (
            <div className="text-white">Loading profile...</div>
          ) : profileData ? (
            <>
              <div className="flex items-center justify-center w-full pt-4">
                <img
                  src={placeholderImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-4"
                />
              </div>
              <h2 className="text-lg text-white">Name: {profileData.fullName}</h2>
              <p className="text-xs lg:text-sm text-gray-300">Email: {profileData.email}</p>
              <p className="text-xs lg:text-sm text-gray-300">Mobile: {profileData.mobileNumber}</p>
              <p className="text-xs lg:text-sm text-gray-300">Designation: {profileData.userType}</p>
              {/* Display facultyName */}
              <p className="text-xs lg:text-sm text-gray-300">Faculty Name: {profileData.facultyName}</p>
            </>
          ) : (
            <div className="text-white">Profile not found</div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-white p-4 absolute right-3 lg:hidden"
        >
          <FaTimes className='text-lg' />
        </button>
      </div>

      {/* Sidebar navigation */}
      <nav className="p-4">
        {/* Home Link */}
        <Link to={userType === 'HOD' ? `${BASEURL}/dashboard/HOD-dashboard` : userType === 'Faculty' ? `${BASEURL}/dashboard/faculty-dashboard` : `${BASEURL}/dashboard/student-dashboard`} className="block text-white p-2 mb-4 hover:bg-slate-700 rounded">
          <FaHome className="inline-block mr-2" /> Home
        </Link>

        {/* Marks Management with Dropdown */}
        <div className="mb-4">
          <div
            className="block text-white p-2 hover:bg-slate-700 rounded flex items-center justify-between cursor-pointer"
            onClick={toggleMarksDropdown}
          >
            <span>
              <FaBook className="inline-block mr-2" /> Marks Management
            </span>
            {isMarksDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {isMarksDropdownOpen && (
            <div className="pl-4 mt-2 space-y-2">
              <Link to={`${BASEURL}/dashboard/HOD-dashboard/marks-management/addmarks`} className="block text-white p-2 hover:bg-slate-700 rounded">
                Add Marks
              </Link>
              <Link to={`${BASEURL}/dashboard/HOD-dashboard/marks-management/permissions`} className="block text-white p-2 hover:bg-slate-700 rounded">
                Permissions
              </Link>
            </div>
          )}
        </div>

        {/* Attendance Management */}
        <Link to="/attendance-management" className="block text-white p-2 mb-4 hover:bg-slate-700 rounded">
          <FaClipboardList className="inline-block mr-2" /> Attendance Management
        </Link>


          <Link to={`${BASEURL}/reports/student-report`} className="block text-white p-2 mb-4 hover:bg-slate-700 rounded">
            <FaChartBar className="inline-block mr-2" /> Reports Management
          </Link>
   
        {userType === 'Faculty' && (
          <Link to="/faculty-section" className="block text-white p-2 mb-4 hover:bg-slate-700 rounded">
            <FaChartBar className="inline-block mr-2" /> Faculty Section
          </Link>
        )}

        {userType === 'Student' && (
          <Link to="/student-resources" className="block text-white p-2 mb-4 hover:bg-slate-700 rounded">
            <FaBook className="inline-block mr-2" /> Student Resources
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
