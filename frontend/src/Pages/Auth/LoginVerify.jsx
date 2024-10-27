//  This Page / Component works with LOGINVERIFY request in backend

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../Context/LoadingContext';
import toast from 'react-hot-toast';

const LoginVerify = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); //Starting loader
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: otp }), // Assuming 'code' is the correct key for OTP
        credentials:'include',
      });

      const data = await response.json();
      setLoading(false); // stopping the loader
      if (data.success) {
        console.log('Backend Response Data:', data);
        if (data.userType == undefined) {
          navigate(`/api/dashboard/student-dashboard`);
        } else {
          navigate(`/api/dashboard/${data.userType}-dashboard`);
        }
      } else {
        setLoading(false) // stopping the loader
        toast.error(data.message);        
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false) // stopping the loader
      toast.error(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login Verification</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="text"
          name="otp"
          placeholder="Enter 6-digit OTP"
          value={otp}
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

export default LoginVerify;
