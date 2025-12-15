import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';

export const issueBook = async (req, res) => {
  const { bookId, memberId, issueDate, returnDate, remarks } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.status === 'ISSUED') return res.status(400).json({ message: 'Book already issued' });

    const transaction = await Transaction.create({
      bookId,
      memberId,
      issueDate,
      returnDate,
      remarks,
    });

    book.status = 'ISSUED';
    await book.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const returnBook = async (req, res) => {
  const { actualReturnDate } = req.body;
  try {
    const transaction = await Transaction.findById(req.params.id).populate('bookId');
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status === 'returned') return res.status(400).json({ message: 'Book already returned' });

    transaction.actualReturnDate = actualReturnDate;
    transaction.status = 'returned';
    if (req.body.remarks) {
      transaction.remarks = req.body.remarks;
    }

    const returnDate = new Date(transaction.returnDate);
    const actualDate = new Date(actualReturnDate);
    const diffTime = Math.abs(actualDate - returnDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (actualDate > returnDate) {
      transaction.fine = diffDays * 10;
      if (req.body.finePaid) {
        transaction.finePaid = true;
      }
    }

    await transaction.save();

    const book = await Book.findById(transaction.bookId._id);
    book.status = 'AVAILABLE';
    await book.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const payFine = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      transaction.finePaid = true;
      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    let query = {};
    // If not admin, only show own transactions
    if (req.user && req.user.role !== 'admin') {
      query = { memberId: req.user._id };
    }

    const transactions = await Transaction.find(query)
      .populate('bookId', 'title authorOrDirector serialNumber')
      .populate('memberId', 'name email');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
