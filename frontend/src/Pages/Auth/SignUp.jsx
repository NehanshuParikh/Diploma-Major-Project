//  This Page / Component works with SIGNUP request in backend

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoading } from '../../Context/LoadingContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const BASE_URL = 'http://localhost:5000/api';


function Signup() {
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    userType: '',
    fullname: '',
    mobile: '',
    department: '',
    school: ''
  });

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasDigit: false,
    hasSpecialChar: false,
    isNotCommon: true // Assuming this is true unless common elements are found
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      validatePassword(value);
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const emailUserCheck = `${formData.email}|${formData.userId}|${formData.fullname}|${formData.department}|${formData.school}`;
    setPasswordValidation({
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasDigit: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isNotCommon: !new RegExp(emailUserCheck, 'i').test(password),

    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        navigate(`/api/auth/verify-email`); // Redirect to signup verification
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mt-6">Signup</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 sm:w-3/5 lg:w-5/12 my-6">
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
          placeholder="User ID / Enrollement ID"
          value={formData.userId}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />

        <select name="department" id="deparment" className="mb-4 p-2 border border-gray-300 rounded w-full" onChange={handleChange}>
          <option defaultChecked>Select Department</option>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
        </select>

        <select name="school" id="school" className="mb-4 p-2 border border-gray-300 rounded w-full" onChange={handleChange}>
          <option defaultChecked>Select School</option>
          <option value="KSET">KSET</option>
          <option value="KSDS">KSDS</option>
        </select>

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
        <ul className='mb-4'>
          <li style={{ color: passwordValidation.minLength ? 'green' : 'red' }}>
            👉 Password should be at least 8 characters long
          </li>
          <li style={{ color: passwordValidation.hasLowercase ? 'green' : 'red' }}>
            👉 Must contain at least 1 lowercase alphabet
          </li>
          <li style={{ color: passwordValidation.hasUppercase ? 'green' : 'red' }}>
            👉 Must contain at least 1 uppercase alphabet
          </li>
          <li style={{ color: passwordValidation.hasDigit ? 'green' : 'red' }}>
            👉 Must contain at least 1 digit
          </li>
          <li style={{ color: passwordValidation.hasSpecialChar ? 'green' : 'red' }}>
            👉 Must contain at least 1 special character
          </li>
          <li style={{ color: passwordValidation.isNotCommon ? 'green' : 'red' }}>
            👉 Password should not be email, user ID, full name, or department name
          </li>
        </ul>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Signup
        </button>
        <Link to="/api/auth/login" className="block text-center mt-4 text-blue-500 hover:underline">Already a user? Login Here</Link> {/* Use Link component */}
      </form>
    </div>
  );
}

export default Signup;
