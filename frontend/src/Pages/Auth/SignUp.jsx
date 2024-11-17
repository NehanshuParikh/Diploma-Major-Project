import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoading } from '../../Context/LoadingContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BASE_URL = 'http://localhost:5000/api';

function Signup() {
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    userType: '',
    fullName: '',
    mobile: '',
    branch: '',
    school: '',
    division: null,
    profilePhoto: null, // File upload
    level: '', // Only for students
    enrollmentDate: '' // only for students
  });

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasDigit: false,
    hasSpecialChar: false,
    isNotCommon: true,
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      validatePassword(value);
    }
    if (name === 'enrollmentDate') {
      const parsedDate = new Date(value);
      setFormData({
        ...formData,
        [name]: parsedDate.toISOString(),
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePhoto: file,
    });
  };

  const validatePassword = (password) => {
    const emailUserCheck = `${formData.email}|${formData.userId}|${formData.fullName}|${formData.branch}|${formData.school}`;
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

    const formDataToSend = new FormData();
    formDataToSend.append('userId', formData.userId);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('userType', formData.userType);
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('mobile', formData.mobile);
    formDataToSend.append('branch', formData.branch);
    formDataToSend.append('school', formData.school);
    formDataToSend.append('profilePhoto', formData.profilePhoto); // File upload

    if (formData.userType === 'Student') {
      formDataToSend.append('level', formData.level); // Append level if userType is Student
      formDataToSend.append('enrollmentDate', formData.enrollmentDate); // Append level if userType is Student
      formDataToSend.append('division', formData.division);
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        body: formDataToSend, // Use FormData for file upload
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        navigate(`/api/auth/verify-email`);
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
          placeholder="User ID / Enrollment ID"
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
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
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

        <select
          name="branch"
          id="branch"
          value={formData.branch}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        >
          <option value="">Select Branch</option>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
        </select>

        <select
          name="school"
          id="school"
          value={formData.school}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        >
          <option value="">Select School</option>
          <option value="KSET">KSET</option>
          <option value="KSDS">KSDS</option>
        </select>

        {/* Conditionally render the level input field for Students */}
        {formData.userType === 'Student' && (
          <input
            type="text"
            name="level"
            placeholder="Level"
            value={formData.level}
            onChange={handleChange}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
          />
        )}
        {/* Conditionally render the level input field for Students */}
        {formData.userType === 'Student' && (
          <input
            type="number"
            name="division"
            placeholder="Division"
            value={formData.division}
            onChange={handleChange}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
          />
        )}
        {/* Conditionally render the Joining Date input field for Students */}
        {formData.userType === 'Student' && (
          <>
            <label htmlFor="enrollmentDate">Enrollement Date</label>
            <input
              type="Date"
              name="enrollmentDate"
              placeholder="Enrollement Date"
              value={formData.enrollmentDate}
              onChange={handleChange}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

          </>
        )}

        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <span className="absolute right-3 top-3 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Password Validation Messages */}
        <ul className="mb-4">
          <li style={{ color: passwordValidation.minLength ? 'green' : 'red' }}>
            👉 Password should be at least 8 characters long
          </li>
          <li style={{ color: passwordValidation.hasLowercase ? 'green' : 'red' }}>
            👉 Must contain at least 1 lowercase letter
          </li>
          <li style={{ color: passwordValidation.hasUppercase ? 'green' : 'red' }}>
            👉 Must contain at least 1 uppercase letter
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


        <label className="mr-2">Profile Photo: </label>
        <input
          type="file"
          name="profilePhoto"
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          placeholder='Profile Photo'
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
        >
          Signup
        </button>
        <Link to="/api/auth/login" className="text-center text-sm text-gray-600 mt-4 block">Already have an account? Login here</Link>
      </form>
    </div>
  );
}

export default Signup;
