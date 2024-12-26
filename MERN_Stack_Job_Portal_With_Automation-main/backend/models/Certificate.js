import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  filename: String,
  path: String,
  originalName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: false }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
