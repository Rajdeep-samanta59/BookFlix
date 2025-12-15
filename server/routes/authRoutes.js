import express from 'express';
import { registerUser, loginUser, getMe, getUsers, updateUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);
router.put('/:id', protect, admin, updateUser);

export default router;
