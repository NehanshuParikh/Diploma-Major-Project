//  This Page / Component works with LOGIN request in backend

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoading } from '../../Context/LoadingContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BASE_URL = 'http://localhost:5000/api';

const Login = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    userType: '', // default value
  });
  const navigate = useNavigate();
  const { setLoading } = useLoading();  // Use setLoading to control the spinner
  const [showPassword, setshowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setshowPassword(!showPassword)
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loader
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);  // Stop loader
      if (data.success) {
        localStorage.setItem('token', data.token);
        navigate('/api/auth/login-verify'); // Redirect to login verification
      } else {
        toast.error(data.message);
        // Show error message to the user
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);  // Stop loader
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <div className="mb-4">
          <label className="mr-2">User Type:</label>
          <label className="mr-4">
            <input
              type="radio"
              name="userType"
              value="Student"
              checked={formData.userType === 'Student'}
              onChange={handleChange}
              className="mr-1"
            />
            Student
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="userType"
              value="HOD"
              checked={formData.userType === 'HOD'}
              onChange={handleChange}
              className="mr-1"
            />
            HOD
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="Faculty"
              checked={formData.userType === 'Faculty'}
              onChange={handleChange}
              className="mr-1"
            />
            Faculty
          </label>
        </div>
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
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
        <div className="flex items-center justify-between gap-6">
          <Link to="/api/auth/forgot-password" className="text-left mb-4 text-blue-500 hover:underline text-sm">Forgot Password?</Link> {/* Use Link component */}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Login
        </button>
        <Link to="/api/auth/signup" className="block text-center mt-4 text-blue-500 hover:underline">Dont have an accocunt? Register Yourself</Link> {/* Use Link component */}
      </form>
    </div>
  );
};

export default Login;
