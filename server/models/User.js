import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  hoVaTen: { type: String, required: true },
  msv: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String }, // Có thể có hoặc không
  role: { type: String, default: 'member' } // 'admin' hoặc 'member'
}, { timestamps: true });

export default mongoose.model('User', userSchema);