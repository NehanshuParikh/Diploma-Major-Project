import React from 'react'
import { useNavigate } from 'react-router'
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';

const StudentDashboardHome = () => {

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json();

      if (data.success) {
        navigate('/api/auth/login')
      } else {
        console.error(data.error)
      }

    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  return (
    <>
      <DashboardLayout>
        <div>StudentDashboard</div>

      </DashboardLayout>
    </>
  )
}

export default StudentDashboardHome