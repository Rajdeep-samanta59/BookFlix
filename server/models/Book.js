import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorOrDirector: { type: String, required: true },
  categoryCode: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  publicationYear: { type: Number },
  type: { type: String, enum: ['BOOK', 'MOVIE'], default: 'BOOK' },
  status: { type: String, enum: ['AVAILABLE', 'ISSUED', 'LOST', 'REMOVED'], default: 'AVAILABLE' },
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
