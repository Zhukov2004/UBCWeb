import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// API ĐĂNG KÝ (Dùng mã sinh viên)
router.post('/register', async (req, res) => {
  try {
    const { hoVaTen, msv, password, email, role } = req.body;

    // Kiểm tra xem Mã sinh viên đã tồn tại chưa
    const existingUser = await User.findOne({ msv });
    if (existingUser) {
      return res.status(400).json({ message: 'Mã sinh viên này đã tồn tại trong hệ thống!' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      hoVaTen,
      msv,
      password: hashedPassword,
      email: email || '',
      role: role || 'member'
    });

    await newUser.save();
    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server: ' + err.message });
  }
});

// API ĐĂNG NHẬP (Dùng mã sinh viên và mật khẩu)
router.post('/login', async (req, res) => {
  try {
    const { msv, password } = req.body;

    // Tìm tài khoản theo Mã sinh viên
    const user = await User.findOne({ msv });
    if (!user) {
      return res.status(400).json({ message: 'Mã sinh viên hoặc mật khẩu không chính xác!' });
    }

    // Kiểm tra mật khẩu mã hóa
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mã sinh viên hoặc mật khẩu không chính xác!' });
    }

    // Tạo JWT Token có hạn trong 1 ngày
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        hoVaTen: user.hoVaTen,
        msv: user.msv,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server: ' + err.message });
  }
});

export default router;