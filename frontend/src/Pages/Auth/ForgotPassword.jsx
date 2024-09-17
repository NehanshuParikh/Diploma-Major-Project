//  This Page / Component works with FORGOTPASSWORD request in backend

import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useLoading } from '../../Context/LoadingContext'
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:5000/api';

const ForgotPassword = () => {

  const [formData, setformData] = useState({
    userId: '',
    email: ''
  })
  const navigate = useNavigate()
  const { setLoading } = useLoading();

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true); //string the loader
    try {
      
      const response = await fetch(`${BASE_URL}/auth/forgot-password`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false) //stopping the loader
      if (data.success) {
        toast.success('Reset Password mail successfully sent on the provided email.')
      }else{
        console.error(data.message);
        toast.error(data.message)
      }

    } catch (error) {
      console.error('Error', error);
      setLoading(false); //stopping the loader
      toast.error(data.message)
    }

  }



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="text"
          name="userId"
          placeholder="User ID"
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
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Proceed
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword