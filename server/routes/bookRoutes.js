import express from 'express';
import { getBooks, getBook, addBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getBooks).post(protect, admin, addBook);
router.route('/:id').get(getBook).put(protect, admin, updateBook).delete(protect, admin, deleteBook);

export default router;
