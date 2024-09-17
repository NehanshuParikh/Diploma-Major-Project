//  This Page / Component works with UPDATEPASSWORD request in backend

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '../../Context/LoadingContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const BASE_URL = 'http://localhost:5000/api';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { token } = useParams(); // Get the token from the URL
  const { setLoading } = useLoading();

  const [showPassword, setshowPassword] = useState(false); // State to toggle password visibility
  const togglePasswordVisibility = () => {
    setshowPassword(!showPassword)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.password }), // Send the new password
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        toast.success("Password reset successful. Please login with your new password.");
        navigate('/api/auth/login'); // Redirect to login after successful reset
      } else {
        console.error(data.message);
        toast(data.message);
      }

    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
      <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;