// Header.js
import React, { useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router';


const Header = ({toggleSidebar}) => {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate()
  
  
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json();

      if (data.success) {
        navigate('/api/auth/login')
      } else {
        console.error(data.error)
      }

    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <header className={`p-4 transition-color duration-500 ease-in-out ${darkMode ? 'bg-[#24303F]' : 'bg-[#FFFFFF]'} flex justify-between items-center w-screen lg:w-[100%]`}>
      <h1 className="text-lg font-bold text-black dark:text-white">Dashboard</h1>
      <div className="flex items-center justify-evenly gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all">
          {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
        </button>
        <button
          onClick={toggleSidebar}
          className="text-black dark:text-white p-4 rounded block lg:hidden"
          >
      <FaBars />
    </button>

    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Logout
    </button>
      </div>
    </header >
  );
};

export default Header