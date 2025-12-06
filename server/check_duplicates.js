import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const checkDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const books = await Book.find({});
    
    const serials = {};
    const duplicates = [];

    books.forEach(b => {
      if (serials[b.serialNumber]) {
        duplicates.push({
          serial: b.serialNumber,
          id1: serials[b.serialNumber]._id,
          title1: serials[b.serialNumber].title,
          id2: b._id,
          title2: b.title
        });
      } else {
        serials[b.serialNumber] = b;
      }
    });

    if (duplicates.length > 0) {
        console.log('Duplicates Found:', duplicates);
    } else {
        console.log('No duplicate serial numbers found.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

checkDuplicates();
