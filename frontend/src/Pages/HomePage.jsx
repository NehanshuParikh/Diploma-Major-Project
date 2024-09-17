import React from 'react'
import { useNavigate } from 'react-router'
const HomePage = () => {
    const navigate = useNavigate();
    const handleSignupRequest = ()=>{
        navigate('/api/auth/signup')
    }
    const handleLoginRequest = ()=>{
        navigate('/api/auth/login')
    }


  return (
    <>
        <button onClick={handleSignupRequest} className='m-4 px-4 py-2  text-white bg-violet-500 rounded'>signup</button>
        <button onClick={handleLoginRequest} className='m-4 px-4 py-2  text-white bg-green-500 rounded'>LogIn</button>
    </>
  )
}

export default HomePage