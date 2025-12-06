import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  membershipNo: { type: String, required: true, unique: true },
  memberName: { type: String, required: true },
  contactDetails: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: String, enum: ['6_MONTHS', '1_YEAR', '2_YEARS'], required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Membership', membershipSchema);
