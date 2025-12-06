import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Membership from './models/Membership.js';

dotenv.config();

const removeMemberships = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const result = await Membership.deleteMany({ membershipNo: { $in: ['123', '900'] } });
    
    console.log(`Deleted ${result.deletedCount} memberships.`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

removeMemberships();
