import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js'; // <-- 1. Import file route thành viên
import accountRoutes from './routes/accountRoutes.js';
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
app.use('/api/users', userRoutes); // 🛠 2. BỔ SUNG DÒNG NÀY ĐỂ KÍCH HOẠT ROUTE USERS
app.use('/api/accounts', accountRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
});