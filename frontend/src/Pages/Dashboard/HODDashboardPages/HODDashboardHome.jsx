import React from 'react';
import { useNavigate } from 'react-router';
import Card from '../../../Components/DashboardComponents/Card';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Import necessary modules from chart.js


// Register the necessary components
ChartJS.register(
  CategoryScale, // X-axis scale
  LinearScale,   // Y-axis scale
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HODDashboardHome = () => {
  const navigate = useNavigate();

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Attendance',
        data: [85, 90, 95, 93, 88],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };


  return (
    <DashboardLayout>
        <div className="flex flex-col gap-4 md:flex-row w-[100%] lg:w-[100%] relative">
          <Card title="Attendance" description="View and manage attendance." />
          <Card title="Marks" description="Check student marks and reports." />
          <Card title="Reports" description="Generate reports for departments." />
          <Card title="File Sharing" description="Manage file sharing for staff and students." />
        </div>
        <div className="mt-10">
          <div className="flex flex-col lg:flex-row flex-shrink items-center justify-center w-full h-max gap-4">
            <div className="card w-full lg:w-1/2 shadow-lg bg-white dark:bg-gray-800 p-4 transition-colors duration-500 ease-in-out cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Attendence Trends</h3>
              <Line data={data} className='w-auto max-h-auto' />
            </div>
            <div className="card w-full lg:w-1/2 shadow-lg bg-white dark:bg-gray-800 p-4 transition-colors duration-500 ease-in-out cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Marks Trends</h3>
              <Line data={data} className='w-auto max-h-auto' />
            </div>
          </div>
        </div>

    </DashboardLayout>
  );
};

export default HODDashboardHome;
