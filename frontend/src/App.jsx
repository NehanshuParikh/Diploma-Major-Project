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
import HODDashboardPermissions from './Pages/Dashboard/HODDashboardPages/HODDashboardPermissions';
import MarksInBulkForm from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/MarksInBulkForm';
import MarksInManualForm from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/MarksInManualForm';
import AssigningDuty from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/AssigningDuty';
import HODManagingDuty from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/HODManagingPermission';
import FacultyManagingDuty from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/FacultyManagingDuty';
import FacultyDashboard from './Pages/Dashboard/FacultyDashboardPages/FacultyDashboardHome';
import StudentDashboard from './Pages/Dashboard/StudentDashboardPages/StudentDashboardHome';
import HODDashboardReport from './Pages/Dashboard/HODDashboardPages/HODDashboardReport';
import MarksInputPage from './Pages/Dashboard/HODDashboardPages/MarksManagementForms/MarksInputPage';
import EditProfilePage from './Pages/Dashboard/EditProfilePage';
import HODDashboardManageStudents from './Pages/Dashboard/HODDashboardPages/HODDashboardManageStudents';
import HODashboardAssignUnits from './Pages/Dashboard/HODDashboardPages/HODashboardAssignUnits';
import UnitViewing from './Pages/Dashboard/UnitViewing';
import HODDashboardAttendance from './Pages/Dashboard/HODDashboardPages/HODDashboardAttendance';
import NormalAttendance from './Pages/Attendance/NormalAttendance';
import ProxyAttendance from './Pages/Attendance/ProxyAttendance';
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
              <Route path="/api/dashboard/Faculty-dashboard" element={<FacultyDashboard />} />
              <Route path="/api/dashboard/Student-dashboard" element={<StudentDashboard />} />
              <Route path="/api/dashboard/edit-profile" element={<EditProfilePage />} />
              <Route path="/api/dashboard/marks-management/addmarks" element={<HODDashboardMarksManagement />} />
              <Route path="/api/dashboard/marks-management/addmarks/inbulk" element={<MarksInBulkForm />} />
              <Route path="/api/dashboard/marks-management/addmarks/manually" element={<MarksInManualForm />} />
              <Route path="/api/dashboard/marks-management/addmarks/manually/input" element={<MarksInputPage />} />
              <Route path="/api/dashboard/marks-management/permissions" element={<HODDashboardPermissions />} />
              <Route path="/api/dashboard/marks-management/permissions/assign-duty" element={<AssigningDuty />} />
              <Route path="/api/dashboard/marks-management/permissions/HOD-viewing-panel" element={<HODManagingDuty />} />
              <Route path="/api/dashboard/marks-management/permissions/Faculty-viewing-panel" element={<FacultyManagingDuty />} />
              <Route path="/api/dashboard/attendance/main-page" element={<HODDashboardAttendance />} />
              <Route path="/api/dashboard/attendance/take/normal-attendance" element={<NormalAttendance />} />
              <Route path="/api/dashboard/attendance/take/proxy-attendance" element={<ProxyAttendance />} />
              <Route path="/api/dashboard/attendance/manage-students" element={<HODDashboardManageStudents />} />
              <Route path="/api/dashboard/attendance/assign-units" element={<HODashboardAssignUnits />} />
              <Route path="/api/dashboard/attendance/view-units" element={<UnitViewing />} />
              <Route path="/api/reports/student-report" element={<HODDashboardReport />} />
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
