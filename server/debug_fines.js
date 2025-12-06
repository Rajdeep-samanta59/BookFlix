import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const debugFines = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const fines = await Transaction.find({ fine: { $gt: 0 }, finePaid: false });
    console.log('Unpaid Fines Count:', fines.length);
    if (fines.length > 0) {
      console.log('Sample Fine:', JSON.stringify(fines[0], null, 2));
    } else {
      console.log('No unpaid fines found.');
    }

    const all = await Transaction.find({});
    console.log('Total Transactions:', all.length);
    console.log('Transaction Statuses:', all.map(t => `${t.status} (Fine: ${t.fine}, Paid: ${t.finePaid})`));

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

debugFines();
