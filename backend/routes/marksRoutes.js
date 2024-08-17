import express from 'express'
import { marksEntry, setExamTypeSubjectBranchDivision, uploadMarksSheet } from '../controllers/marksController.js'
import multer from 'multer'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()
const upload = multer({ dest: "uploads/" })  // 'uploads' is at the same level as our server entry point

router.post('/setExamTypeSubjectBranchDivision',verifyToken,setExamTypeSubjectBranchDivision)
router.post('/marksEntry',verifyToken, marksEntry)
router.post('/uploadMarksSheet',verifyToken,upload.single('file'), uploadMarksSheet)

export default router