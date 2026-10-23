import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js'; 
import accountRoutes from './routes/accountRoutes.js';
import profileRoutes from './routes/profile.js';
import shiftRoutes from './routes/shiftRoutes.js'; // ✅ Sửa lại dùng import chuẩn ESM và có đuôi .js

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB thành công!'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Khai báo Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/accounts', accountRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/profile', profileRoutes);
app.use('/api/shifts', shiftRoutes); // ✅ Đăng ký route ca trực thành công

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
});