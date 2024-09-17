import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';
import SearchBar from '../../../Components/DashboardComponents/SearchBar';

const HODDashboardReport = () => {
  const [student, setStudent] = useState(null);
  const [examType, setExamType] = useState('');
  const [semester, setSemester] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Fetch student suggestions from MongoDB
  const fetchStudents = async (query) => {
    const response = await fetch(`http://localhost:5000/api/students?query=${query}`);
    const data = await response.json();
    setStudentsList(data);
  };

  const handleSearch = (searchQuery) => {
    setStudent(searchQuery); // Set the selected student
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reports/student-report?searchQuery=${student._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/pdf' },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${student.fullname}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/reports/view/studentReportSheet?searchQuery=${student._id}&examType=${examType}&semester=${semester}`);
      const data = await response.json();
      setReportData(data); // Assuming data contains report details
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 dark:bg-gray-800 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Report Management</h1>

        <div className="mb-6">
          {/* Search Bar with dynamic student fetching */}
          <SearchBar
            onSearch={handleSearch}
            fetchStudents={fetchStudents} // Pass the fetch function to the SearchBar
            suggestions={studentsList}
          />
        </div>

        {student && (
          <>
            <div className="mb-4">
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">Select Exam Type</option>
                <option value="Mid-1">Mid-1</option>
                <option value="Mid-2">Mid-2</option>
                <option value="External">External</option>
              </select>
            </div>

            <div className="mb-4">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleViewReport}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                {loading ? 'Loading...' : 'View Report'}
              </button>
              <button
                onClick={handleDownload}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {loading ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          </>
        )}

        {reportData && (
          <div className="mt-6">
            {/* Display Report Data Here */}
            <h2 className="text-xl font-semibold">Report for {student.fullname}</h2>
            <p>Exam Type: {examType}</p>
            <p>Semester: {semester}</p>
            {/* Render reportData as required */}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HODDashboardReport;
