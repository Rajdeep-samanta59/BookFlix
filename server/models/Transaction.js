import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  actualReturnDate: { type: Date },
  fine: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: { type: String },
  status: { type: String, enum: ['issued', 'returned'], default: 'issued' },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
