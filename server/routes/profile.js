import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Cấu hình lưu trữ ảnh upload bằng multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// =========================================================================
// 1. GET: Lấy thông tin cá nhân từ collection `ubc20252026` (Đã sửa lỗi quét nhầm)
// =========================================================================
router.get('/me/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Tìm tài khoản trong collection 'users'
        const user = await mongoose.connection.collection('users').findOne({
            _id: new mongoose.Types.ObjectId(userId)
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng!' });
        }

        // Xây dựng điều kiện tìm kiếm an toàn (Chỉ tìm khi có giá trị thật)
        let queryConditions = [];
        if (user.msv && user.msv.trim() !== '') {
            queryConditions.push({ 'Mã SV': user.msv });
            queryConditions.push({ msv: user.msv });
            queryConditions.push({ MSV: user.msv });
        }
        if (user.email && user.email.trim() !== '') {
            queryConditions.push({ email: user.email });
        }

        let memberProfile = null;
        if (queryConditions.length > 0) {
            memberProfile = await mongoose.connection.collection('ubc20252026').findOne({
                $or: queryConditions
            });
        }

        // Nếu tìm thấy trong ubc20252026, trả về thông tin chi tiết
        if (memberProfile) {
            return res.json({
                ...memberProfile,
                hoVaTen: memberProfile['Họ và tên'] || memberProfile.hoVaTen || user.username,
                msv: memberProfile['Mã SV'] || memberProfile.msv || user.msv || '',
                email: memberProfile.email || user.email || ''
            });
        }

        // Nếu Super Admin chưa có trong ubc20252026, trả về thông tin cơ bản từ user
        res.json({
            hoVaTen: user.username || user.hoVaTen || 'Super Admin',
            msv: user.msv || '',
            email: user.email || ''
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =========================================================================
// 2. PUT: Cập nhật thông tin cá nhân và ảnh đại diện vào `ubc20252026`
// =========================================================================
router.put('/me/:id', upload.single('anhThe'), async (req, res) => {
    try {
        const userId = req.params.id;
        const { hoVaTen, msv, ban, khoa, nganh, lop, ngaySinh, que, facebook } = req.body;

        const user = await mongoose.connection.collection('users').findOne({
            _id: new mongoose.Types.ObjectId(userId)
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        const updateData = {
            'Họ và tên': hoVaTen,
            hoVaTen: hoVaTen,
            'Mã SV': msv,
            msv: msv,
            ban: ban,
            khoa: khoa,
            nganh: nganh,
            lop: lop,
            ngaySinh: ngaySinh,
            que: que,
            facebook: facebook
        };

        if (req.file) {
            updateData['Ảnh thẻ'] = `/uploads/${req.file.filename}`;
            updateData.anhThe = `/uploads/${req.file.filename}`;
        }

        // Cập nhật hoặc tạo mới bản ghi trong collection `ubc20252026`
        const result = await mongoose.connection.collection('ubc20252026').findOneAndUpdate(
            { $or: [{ 'Mã SV': msv }, { msv: msv }, { email: user.email }] },
            { $set: updateData },
            { upsert: true, returnDocument: 'after' }
        );

        res.json({ message: 'Cập nhật thông tin thành công!', user: result.value });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;