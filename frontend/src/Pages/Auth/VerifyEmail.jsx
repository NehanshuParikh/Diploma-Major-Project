//  This Page / Component works with SIGNUPVERIFYEMAIL request in backend

import React, { useState } from 'react';
import { useLoading } from '../../Context/LoadingContext';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
const BASE_URL = 'http://localhost:5000/api';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include'
      });

      const data = await response.json();
      setLoading(false);
      console.log('Backend Response Data:', data);
      // Redirect to login page after successful signup verification
      if (data.userType == undefined) {
        navigate(`/api/dashboard/student-dashboard`);
      } else {
        navigate(`/api/dashboard/${data.userType}-dashboard`);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Signup Verification</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="text"
          name="code"
          placeholder="Enter 6-digit OTP"
          value={code}
          onChange={handleChange}
          maxLength="6"
          className="mb-4 p-2 border border-gray-300 rounded w-full text-center"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
