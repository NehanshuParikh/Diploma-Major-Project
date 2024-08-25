import express from 'express'
import { marksEntry, setExamTypeSubjectBranchDivision, uploadMarksSheet } from '../controllers/marksController.js'
import multer from 'multer'
import { verifyToken } from '../middleware/verifyToken.js'
import { requestPermission, managePermissionRequests, manageFacultyPermissions, updatePermissionStatus } from '../controllers/permissionController.js'
const router = express.Router()
const upload = multer({ dest: "uploads/" })  // 'uploads' is at the same level as our server entry point

// Route for faculty to request permission to HOD
router.post('/request-permission',verifyToken, requestPermission);
// Route for faculty to view their permissions
router.get('/managePermission', verifyToken, manageFacultyPermissions);
// Route for HOD to update permission status
router.post('/updatePermissionStatus', verifyToken, updatePermissionStatus);
// Route for HOD to to view all their permissions
router.post('/manage-permission',verifyToken, managePermissionRequests);


router.post('/setExamTypeSubjectBranchDivision',verifyToken,setExamTypeSubjectBranchDivision)
router.post('/marksEntry',verifyToken, marksEntry)
router.post('/uploadMarksSheet',verifyToken,upload.single('file'), uploadMarksSheet)

export default router