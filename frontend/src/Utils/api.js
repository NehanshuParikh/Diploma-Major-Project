// src/utils/api.js

const BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

// Auth API functions
export const signup = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
  });
  return response.json();
};

export const checkAuth = async (token) => {
  const response = await fetch(`${BASE_URL}/auth/check-auth`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const verifyEmail = async (emailData) => {
  const response = await fetch(`${BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });
  return response.json();
};

export const verifyLogin = async (loginData) => {
  const response = await fetch(`${BASE_URL}/auth/verify-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });
  return response.json();
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPassword }),
  });
  return response.json();
};

// Marks API functions
export const requestPermission = async (permissionData, token) => {
  const response = await fetch(`${BASE_URL}/marksManagement/request-permission`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(permissionData),
  });
  return response.json();
};

export const manageFacultyPermissions = async (token) => {
  const response = await fetch(`${BASE_URL}/marksManagement/managePermission`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const updatePermissionStatus = async (statusData, token) => {
  const response = await fetch(`${BASE_URL}/marksManagement/updatePermissionStatus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(statusData),
  });
  return response.json();
};

export const managePermissionRequests = async (token) => {
  const response = await fetch(`${BASE_URL}/marksManagement/manage-permission`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const setExamTypeSubjectBranchDivision = async (data, token) => {
  const response = await fetch(`${BASE_URL}/marksManagement/setExamTypeSubjectBranchDivision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const marksEntry = async (data, token) => {
  const response = await fetch(`${BASE_URL}/marksManagement/marksEntry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const uploadMarksSheet = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/marksManagement/uploadMarksSheet`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return response.json();
};

// Report API functions
export const generateStudentReport = async () => {
  const response = await fetch(`${BASE_URL}/reports/student-report`, {
    method: 'GET',
  });
  return response.blob();
};

export const viewStudentReportSheet = async (token) => {
  const response = await fetch(`${BASE_URL}/reports/view/studentReportSheet`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.blob();
};
