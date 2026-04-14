import express from 'express';
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getComplaintsByCategory,
  getComplaintsByStatus,
  getComplaintLiveSummary,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createComplaint);
router.get('/complaint/:complaintId', getComplaintById);
router.get('/summary', getComplaintLiveSummary);

// Admin routes
router.get('/', verifyToken, verifyAdmin, getAllComplaints);
router.put('/:complaintId', verifyToken, verifyAdmin, updateComplaintStatus);
router.delete('/:complaintId', verifyToken, verifyAdmin, deleteComplaint);

// Analytics routes
router.get('/analytics/category', verifyToken, verifyAdmin, getComplaintsByCategory);
router.get('/analytics/status', verifyToken, verifyAdmin, getComplaintsByStatus);

export default router;
