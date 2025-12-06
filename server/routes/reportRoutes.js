import express from 'express';
import { getReports } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getReports);

export default router;
