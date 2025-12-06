import Book from '../models/Book.js';

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBook = async (req, res) => {
  const { title, authorOrDirector, categoryCode, serialNumber, publicationYear, type } = req.body;
  try {
    const bookExists = await Book.findOne({ serialNumber });
    if (bookExists) return res.status(400).json({ message: 'Book with this serial number already exists' });

    const book = await Book.create({ title, authorOrDirector, categoryCode, serialNumber, publicationYear, type });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      book.title = req.body.title || book.title;
      book.authorOrDirector = req.body.authorOrDirector || book.authorOrDirector;
      book.categoryCode = req.body.categoryCode || book.categoryCode;
      book.serialNumber = req.body.serialNumber || book.serialNumber;
      book.publicationYear = req.body.publicationYear || book.publicationYear;
      book.type = req.body.type || book.type;
      book.status = req.body.status || book.status;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      await book.deleteOne();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
