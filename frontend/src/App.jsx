import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLoading } from './Context/LoadingContext';  // Import the provider
import HomePage from './Pages/HomePage';
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import LoginVerify from './Pages/Auth/LoginVerify';
import VerifyEmail from './Pages/Auth/VerifyEmail';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import { BlinkBlur } from 'react-loading-indicators';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './Context/ThemeContext';
import { ProfileProvider } from './Context/ProfileContext';
import HODDashboardHome from './Pages/Dashboard/HODDashboardPages/HODDashboardHome';
import HODDashboardMarksManagement from './Pages/Dashboard/HODDashboardPages/HODDashboardMarksManagement';
import HODDashboardAttendenceManagement from './Pages/Dashboard/HODDashboardPages/HODDashboardAttendenceManagement';
import HODDashboardPermissions from './Pages/Dashboard/HODDashboardPages/HODDashboardPermissions';
import MarksInBulkForm from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/MarksInBulkForm';
import MarksInManualForm from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/MarksInManualForm';
import RequestingPermission from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/RequestingPermission';
import ManagingRequest from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/ManagingRequest';
import FacultyDashboard from './Pages/Dashboard/FacultyDashboardPages/FacultyDashboardHome';
import StudentDashboard from './Pages/Dashboard/StudentDashboardPages/StudentDashboardHome';
import HODDashboardReport from './Pages/Dashboard/HODDashboardPages/HODDashboardReport';
function App() {
  const { loading } = useLoading();
  return (
    <>
      <ThemeProvider>
        <ProfileProvider>
          {loading && (
            <div className="loader">
              <BlinkBlur color="#31c5cc" size="medium" text="Loading" textColor="#000" className="loader" />
            </div>
          )}
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/api/auth/signup" element={<SignUp />} />
              <Route path="/api/auth/verify-email" element={<VerifyEmail />} />
              <Route path="/api/auth/login" element={<Login />} />
              <Route path="/api/auth/login-verify" element={<LoginVerify />} />
              <Route path="/api/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/api/auth/reset-password/:token" element={<ResetPassword />} />
              <Route path="/api/dashboard/HOD-dashboard" element={<HODDashboardHome />} />
              <Route path="/api/dashboard/HOD-dashboard/marks-management/addmarks" element={<HODDashboardMarksManagement />} />
              <Route path="/api/dashboard/HOD-dashboard/marks-management/addmarks/inbulk" element={<MarksInBulkForm />} />
              <Route path="/api/dashboard/HOD-dashboard/marks-management/addmarks/manually" element={<MarksInManualForm />} />
              <Route path="/api/dashboard/HOD-dashboard/marks-management/permissions" element={<HODDashboardPermissions />} />
              <Route path="/api/dashboard/HOD-dashboard/marks-management/permissions/request" element={<RequestingPermission />} />
              <Route path="/api/dashboard/HOD-dashboard/marks-management/permissions/manage" element={<ManagingRequest />} />
              <Route path="/api/reports/student-report" element={<HODDashboardReport />} />
              <Route path="/api/dashboard/HOD-dashboard/attendence-management" element={<HODDashboardAttendenceManagement />} />
              <Route path="/api/dashboard/Faculty-dashboard" element={<FacultyDashboard />} />
              <Route path="/api/dashboard/Student-dashboard" element={<StudentDashboard />} />
            </Routes>
          </Router>
        </ProfileProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
