import express from 'express';
import { addMembership, updateMembership, getMembership, getAllMemberships } from '../controllers/memberController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, addMembership);
router.put('/:id', protect, admin, updateMembership);
router.get('/', protect, getAllMemberships);
router.get('/:id', protect, getMembership);

export default router;
