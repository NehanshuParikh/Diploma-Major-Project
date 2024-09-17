// src/utils/constants.js

export const BASE_URL = 'http://localhost:5000/api'; // Adjust as necessary

export const AUTH_ROUTES = {
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  CHECK_AUTH: `${BASE_URL}/auth/check-auth`,
  VERIFY_EMAIL: `${BASE_URL}/auth/verify-email`,
  VERIFY_LOGIN: `${BASE_URL}/auth/verify-login`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password/`,
};

export const MARKS_ROUTES = {
  REQUEST_PERMISSION: `${BASE_URL}/marksManagement/request-permission`,
  MANAGE_PERMISSION: `${BASE_URL}/marksManagement/managePermission`,
  UPDATE_PERMISSION_STATUS: `${BASE_URL}/marksManagement/updatePermissionStatus`,
  MANAGE_PERMISSION_REQUESTS: `${BASE_URL}/marksManagement/manage-permission`,
  SET_EXAM_TYPE: `${BASE_URL}/marksManagement/setExamTypeSubjectBranchDivision`,
  MARKS_ENTRY: `${BASE_URL}/marksManagement/marksEntry`,
  UPLOAD_MARKS_SHEET: `${BASE_URL}/marksManagement/uploadMarksSheet`,
};

export const REPORT_ROUTES = {
  GENERATE_STUDENT_REPORT: `${BASE_URL}/reports/student-report`,
  VIEW_STUDENT_REPORT_SHEET: `${BASE_URL}/reports/view/studentReportSheet`,
};
