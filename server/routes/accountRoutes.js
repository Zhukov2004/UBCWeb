import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Định nghĩa Schema cho tài khoản hệ thống (Kết nối trực tiếp collection 'users')
const AccountSchema = new mongoose.Schema({
    username: { type: String },
    hoVaTen: { type: String },
    msv: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' }
}, { timestamps: true, collection: 'users' });

const Account = mongoose.models.UserAccount || mongoose.model('UserAccount', AccountSchema, 'users');

// =========================================================================
// 1. GET: Lấy danh sách tất cả tài khoản
// =========================================================================
router.get('/', async (req, res) => {
    try {
        const accounts = await Account.find({}).select('-password');
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =========================================================================
// 2. POST: Thêm tài khoản mới (Admin/Super Admin tạo)
// =========================================================================
router.post('/', async (req, res) => {
    try {
        const { username, email, password, msv, role } = req.body;

        const existingUser = await Account.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã tồn tại trên hệ thống!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAccount = new Account({
            username,
            hoVaTen: username,
            email,
            password: hashedPassword,
            msv,
            role: role || 'user'
        });

        await newAccount.save();
        res.status(201).json({ message: 'Tạo tài khoản thành công!' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// =========================================================================
// 3. PUT: Cập nhật thông tin tài khoản (Chỉnh sửa Tên, Email, MSV, Role)
// =========================================================================
router.put('/:id', async (req, res) => {
    try {
        const { username, email, msv, role } = req.body;

        const updatedAccount = await Account.findByIdAndUpdate(
            req.params.id,
            { username, hoVaTen: username, email, msv, role },
            { new: true }
        ).select('-password');

        if (!updatedAccount) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        res.json(updatedAccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// =========================================================================
// 4. PUT: THÀNH VIÊN TỰ ĐỔI MẬT KHẨU (Yêu cầu xác thực mật khẩu CŨ chính xác)
// Endpoint: /api/accounts/:id/change-password
// =========================================================================
router.put('/:id/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới!' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải từ 6 ký tự trở lên!' });
        }

        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        // Kiểm tra mật khẩu CŨ có khớp không
        const isMatch = await bcrypt.compare(currentPassword, account.password);
        if (!isMatch) {
            return res.status(400).json({ message: '⚠️ Mật khẩu hiện tại không chính xác!' });
        }

        // Mã hóa mật khẩu MỚI
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // 👉 Dùng findByIdAndUpdate thay vì account.save() để tránh lỗi validate các trường cũ (như email)
        await Account.findByIdAndUpdate(req.params.id, {
            password: hashedNewPassword
        });

        res.json({ message: 'Đổi mật khẩu thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =========================================================================
// 5. PUT: Admin Reset mật khẩu nhanh cho tài khoản khác (Không cần MK cũ)
// Endpoint: /api/accounts/:id/reset-password
// =========================================================================
router.put('/:id/reset-password', async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updated = await Account.findByIdAndUpdate(
            req.params.id, 
            { password: hashedPassword }, 
            { new: true }
        ).select('-password');

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        res.json({ message: 'Đặt lại mật khẩu thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =========================================================================
// 6. PUT: Cập nhật phân quyền (Role) - Kiểm soát chặt chẽ theo Super Admin
// Endpoint: /api/accounts/:id/role
// =========================================================================
router.put('/:id/role', async (req, res) => {
    try {
        const { role: newRole, requesterRole } = req.body; 
        const normalizedRequester = requesterRole ? requesterRole.toLowerCase() : '';

        // 1. Chặn nâng lên Super Admin
        if (newRole === 'superadmin') {
            return res.status(403).json({ 
                message: '⚠️ Không ai có quyền nâng tài khoản lên Super Admin!' 
            });
        }

        // 2. Chỉ Super Admin mới có quyền nâng người khác lên Admin
        if (newRole === 'admin' && normalizedRequester !== 'superadmin') {
            return res.status(403).json({ 
                message: '⚠️ Bạn là Admin thường nên không có quyền nâng người khác lên Admin!' 
            });
        }

        const accountToUpdate = await Account.findById(req.params.id);
        if (!accountToUpdate) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        // 3. Bảo vệ tài khoản Super Admin khác
        if (accountToUpdate.role?.toLowerCase() === 'superadmin' && normalizedRequester !== 'superadmin') {
            return res.status(403).json({ 
                message: '⚠️ Bạn không có quyền can thiệp vào tài khoản Super Admin khác!' 
            });
        }

        accountToUpdate.role = newRole;
        await accountToUpdate.save();

        const updatedUser = await Account.findById(req.params.id).select('-password');
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// =========================================================================
// 7. DELETE: Xóa tài khoản - Có chốt chặn bảo vệ không để trống Admin
// =========================================================================
router.delete('/:id', async (req, res) => {
    try {
        const accountToDelete = await Account.findById(req.params.id);
        if (!accountToDelete) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        // Chốt chặn an toàn: Kiểm tra số lượng Admin còn lại
        if (accountToDelete.role === 'admin' || accountToDelete.role === 'superadmin') {
            const adminCount = await Account.countDocuments({ role: { $in: ['admin', 'superadmin'] } });
            if (adminCount <= 1) {
                return res.status(400).json({ 
                    message: '⚠️ Từ chối xóa! Hệ thống không thể để trống vị trí Quản trị viên.' 
                });
            }
        }

        await Account.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa tài khoản thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;