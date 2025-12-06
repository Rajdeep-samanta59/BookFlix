import Book from '../models/Book.js';
import Membership from '../models/Membership.js';
import Transaction from '../models/Transaction.js';

export const getReports = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const booksIssued = await Book.countDocuments({ status: 'issued' });
    const booksAvailable = await Book.countDocuments({ status: 'available' });

    const totalMembers = await Membership.countDocuments({ status: 'active' });

    const totalTransactions = await Transaction.countDocuments();
    const pendingReturns = await Transaction.countDocuments({ status: 'issued' });

    const transactions = await Transaction.find({ fine: { $gt: 0 } });
    const totalFine = transactions.reduce((acc, curr) => acc + curr.fine, 0);
    const fineCollected = transactions.filter(t => t.finePaid).reduce((acc, curr) => acc + curr.fine, 0);
    const finePending = totalFine - fineCollected;

    res.json({
      totalBooks,
      booksIssued,
      booksAvailable,
      totalMembers,
      totalTransactions,
      pendingReturns,
      totalFine,
      fineCollected,
      finePending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
