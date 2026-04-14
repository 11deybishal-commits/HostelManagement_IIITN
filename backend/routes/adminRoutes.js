import express from 'express';
import { loginAdmin, getAdminProfile, createAdmin, registerAdmin } from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Protected routes
router.get('/profile', verifyToken, getAdminProfile);
router.post('/create', verifyToken, verifyAdmin, createAdmin);

export default router;
