import express from 'express'
import { marksEntry, setExamTypeSubjectBranchDivision, uploadMarksSheet } from '../controllers/marksController.js'
import multer from 'multer'
import { verifyToken } from '../middleware/verifyToken.js'
import { assignDuty, viewAssignedDuties, viewFacultyDuties } from '../controllers/permissionController.js'
const router = express.Router()
const upload = multer({ dest: "uploads/" })  // 'uploads' is at the same level as our server entry point


// Assign duty to a faculty (HOD only)
router.post('/assign-duty', verifyToken, assignDuty);

// Faculty marks entry (linked to marks entry and permission update)
router.post('/marksEntry', verifyToken, marksEntry);

// View all permissions assigned by HOD
router.get('/hod/assigned-duties', verifyToken, viewAssignedDuties);

// View all permissions assigned to a faculty
router.get('/faculty/duties', verifyToken, viewFacultyDuties);


// To delete the duties from the HOD Panel
router.delete('/hod/assigned-duty/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Duty.findByIdAndDelete(id); // Find and delete the duty by ID

        if (!result) {
            return res.status(404).json({ message: 'Duty not found' });
        }

        res.status(200).json({ message: 'Duty deleted successfully' });
    } catch (error) {
        console.error('Error deleting duty:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/setExamTypeSubjectBranchDivision', verifyToken, setExamTypeSubjectBranchDivision)
router.post('/marksEntry', verifyToken, marksEntry)
router.post('/uploadMarksSheet', verifyToken, upload.single('file'), uploadMarksSheet)

export default router