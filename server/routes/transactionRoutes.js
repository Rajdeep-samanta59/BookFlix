import express from 'express';
import { issueBook, returnBook, payFine, getTransactions } from '../controllers/transactionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getTransactions).post(protect, issueBook);
router.put('/:id/return', protect, returnBook);
router.put('/:id/payfine', protect, payFine);

export default router;
