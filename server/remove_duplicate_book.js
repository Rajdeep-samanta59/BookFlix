import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const removeDuplicate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Removing the one with the typo or the older one.
    // Based on previous output: id1: 693403d4b87a69fb4259e96c (The God's of Small Thing)
    // id2: 693403f51919dea1f4846368 (The God of Small Things) - Keep this one.
    
    await Book.findByIdAndDelete('693403d4b87a69fb4259e96c');
    console.log('Deleted duplicate book with typo.');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

removeDuplicate();
