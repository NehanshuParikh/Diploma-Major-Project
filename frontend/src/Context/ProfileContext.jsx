// ProfileContext.js
import React, { createContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

const PROFILE_URL = 'http://localhost:5000/api/user/profile'; // Backend API

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(PROFILE_URL, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      if (result.success) {
        setProfileData(result.data);
      } else {
        console.error('Error fetching profile:', result.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData(); // Fetch profile data on mount
  }, []);

  return (
    <ProfileContext.Provider value={{ profileData, loading, fetchProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
