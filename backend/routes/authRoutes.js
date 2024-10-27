import express from 'express'
import { login, loginVerify, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/authControllers.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { upload } from '../middleware/multer.js'
const router = express.Router()

router.post('/signup',upload.single('profilePhoto'),signup)
router.post('/login',login)
router.post('/logout',logout)

router.get('/check-auth', verifyToken, checkAuth)
router.post('/verify-email', verifyEmail)
router.post('/verify-login', loginVerify)
router.post('/forgot-password', forgotPassword)
router.post(`/reset-password/:token`, resetPassword)

export default router