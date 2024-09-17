// src/Pages/HODDashboardReport.js
import React, { useState } from 'react';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';
import SearchBar from '../../../Components/DashboardComponents/SearchBar';

const HODDashboardReport = () => {
  const [student, setStudent] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [examType, setExamType] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (student) => {
    setStudent(student);
    setReportData(null); // Reset previous report data
    const { userId } = student;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/reports/view/studentReportSheet?searchQuery=${userId}&examType=${examType}&semester=${semester}`
      );
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
      } else {
        setReportData(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report:', error);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!student) return;
    const { userId } = student;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/reports/student-report?searchQuery=${userId}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${userId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setLoading(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 dark:bg-gray-800 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Report Management</h1>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Exam Type and Semester Filters */}
        {student && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Viewing Report for: {student.fullname} ({student.userId})
            </h2>

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

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleSearch(student)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {loading ? 'Loading...' : 'View Report'}
              </button>
              <button
                onClick={handleDownload}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                {loading ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          </div>
        )}

        {/* Display Report Data */}
        {reportData && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Report Data</h2>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Subject</th>
                  <th className="py-2 px-4 border">Marks</th>
                  <th className="py-2 px-4 border">Exam Type</th>
                  <th className="py-2 px-4 border">Semester</th>
                </tr>
              </thead>
              <tbody>
                {reportData.marksDetails.map((mark) => (
                  <tr key={mark._id}>
                    <td className="py-2 px-4 border">{mark.subject}</td>
                    <td className="py-2 px-4 border">{mark.marks}</td>
                    <td className="py-2 px-4 border">{mark.examType}</td>
                    <td className="py-2 px-4 border">{mark.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No data message */}
        {!loading && student && !reportData && (
          <p className="text-red-500 mt-4">No report data available for this student.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HODDashboardReport;
