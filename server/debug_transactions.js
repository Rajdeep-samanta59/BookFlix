import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const debugTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const transactions = await Transaction.find({});
    console.log('Total Transactions:', transactions.length);
    if (transactions.length > 0) {
      console.log('First Transaction:', JSON.stringify(transactions[0], null, 2));
      console.log('Statuses:', transactions.map(t => t.status));
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

debugTransactions();
