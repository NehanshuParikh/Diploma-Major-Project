// DashboardLayout.js
import React, { useState, useContext, useEffect } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import ProfileContext from '../../Context/ProfileContext'; // Import ProfileContext

const DashboardLayout = ({ children }) => {
  const { darkMode } = useTheme();
  const { profileData, loading, fetchProfileData } = useContext(ProfileContext); // Use ProfileContext
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProfileData(); // Fetch profile data on component mount
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (!profileData) {
    return <div>Error: Profile not found!</div>; // Show error if profileData is not found
  }

  return (
    <div
      className={`flex min-h-screen ${darkMode ? 'bg-[#1A222C]' : 'bg-[#F1F5F9]'} transition-colors duration-300 w-full`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} userType={profileData.userType} />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
