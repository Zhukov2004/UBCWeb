import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt'; // Import thư viện mã hóa

const router = express.Router();

// 1. Lấy danh sách tài khoản
router.get('/', async (req, res) => {
    try {
        const accounts = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách tài khoản!' });
    }
});

// 2. Xóa tài khoản
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa tài khoản thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa tài khoản!' });
    }
});

// 3. Đổi quyền (Role)
router.put('/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ!' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi cập nhật quyền!' });
    }
});

// 4. ĐẶT LẠI MẬT KHẨU (Có mã hóa bcrypt)
router.put('/:id/reset-password', async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
        }

        // Mã hóa mật khẩu trước khi lưu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { password: hashedPassword }, // Lưu chuỗi đã mã hóa
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        res.json({ message: 'Đặt lại và mã hóa mật khẩu thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi mã hóa và đặt lại mật khẩu!' });
    }
});

export default router;