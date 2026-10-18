import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Tự động tạo thư mục 'uploads' nếu chưa tồn tại
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Cấu hình Multer để lưu file ảnh vào ổ cứng server
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Tên file duy nhất
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước file tối đa 5MB
});

// Schema và Model Mongoose
const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'ubc20252026' });
const UbcMember = mongoose.models.UbcMember || mongoose.model('UbcMember', UserSchema, 'ubc20252026');

// 1. GET: Lấy danh sách thành viên
router.get('/', async (req, res) => {
    try {
        const rawUsers = await UbcMember.find({});
        const formattedUsers = rawUsers.map(user => {
            const u = user.toObject();
            return {
                _id: u._id,
                hoVaTen: u['Họ và tên'] || u.hoVaTen || 'Chưa cập nhật',
                msv: u['Mã SV'] || u['Mã sinh viên'] || u.msv || '---',
                ban: u['Ban'] || u.ban || 'Thành viên',
                ngaySinh: u['Ngày sinh'] || u.ngaySinh || '---',
                khoa: u['Khoa'] || u.khoa || 'Chưa cập nhật',
                lop: u['Lớp'] || u.lop || 'Chưa cập nhật',
                gen: u['Gen'] || u.gen || 'N/A',
                facebook: u['Facebook'] || u.facebook || '',
                mailTruong: u['Mail trường'] || u['Email trường'] || u.mailTruong || '',
                que: u['Quê'] || u['Quê quán'] || u.que || 'Chưa cập nhật',
                anhThe: u['Ảnh thẻ'] || u.anhThe || ''
            };
        });
        res.json(formattedUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. POST: Thêm thành viên mới (Có upload file 'anhThe')
router.post('/', upload.single('anhThe'), async (req, res) => {
    try {
        // Nếu người dùng chọn file thì lấy đường dẫn file mới (/uploads/filename), nếu không thì lấy link URL chữ
        const anhTheUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.anhThe || '');

        const newMemberData = {
            'Họ và tên': req.body.hoVaTen,
            'Mã SV': req.body.msv,
            'Ban': req.body.ban,
            'Ngày sinh': req.body.ngaySinh,
            'Khoa': req.body.khoa,
            'Lớp': req.body.lop,
            'Gen': req.body.gen,
            'Facebook': req.body.facebook,
            'Mail trường': req.body.mailTruong,
            'Quê': req.body.que,
            'Ảnh thẻ': anhTheUrl
        };

        const newMember = new UbcMember(newMemberData);
        await newMember.save();
        res.status(201).json({ message: 'Thêm thành viên thành công' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. PUT: Cập nhật thông tin thành viên (Có upload file 'anhThe')
router.put('/:id', upload.single('anhThe'), async (req, res) => {
    try {
        const updateData = {
            'Họ và tên': req.body.hoVaTen,
            'Mã SV': req.body.msv,
            'Ban': req.body.ban,
            'Ngày sinh': req.body.ngaySinh,
            'Khoa': req.body.khoa,
            'Lớp': req.body.lop,
            'Gen': req.body.gen,
            'Facebook': req.body.facebook,
            'Mail trường': req.body.mailTruong,
            'Quê': req.body.que
        };

        // Chỉ cập nhật ảnh thẻ nếu người dùng tải lên file mới
        if (req.file) {
            updateData['Ảnh thẻ'] = `/uploads/${req.file.filename}`;
        } else if (req.body.anhThe) {
            updateData['Ảnh thẻ'] = req.body.anhThe;
        }

        const updated = await UbcMember.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy thành viên để cập nhật' });
        res.json({ message: 'Cập nhật thành công', data: updated });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. DELETE: Xóa thành viên
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await UbcMember.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy thành viên để xóa' });
        res.json({ message: 'Đã xóa thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;