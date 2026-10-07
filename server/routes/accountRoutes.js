import express from 'express';
import User from '../models/User.js'; // Hoặc đường dẫn đến model User/Account của bạn

const router = express.Router();

// 1. Lấy danh sách tài khoản
router.get('/', async (req, res) => {
    try {
        const accounts = await User.find().select('-password');
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

// 3. Đổi quyền (Role) thành admin hoặc user
router.put('/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        
        // Kiểm tra role gửi lên có hợp lệ không
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò (Role) không hợp lệ!' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true } // Trả về document sau khi đã update
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật quyền tài khoản!' });
    }
});

export default router; // Bắt buộc phải có dòng này ở cuối file