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
// 1. GET: Lấy thông tin cá nhân từ collection `ubc20252026`
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

        let queryConditions = [
            { userId: userId }
        ];
        
        if (user.msv && user.msv.trim() !== '') {
            queryConditions.push({ msv: user.msv });
            queryConditions.push({ 'Mã SV': user.msv });
            queryConditions.push({ MSV: user.msv });
        }
        if (user.email && user.email.trim() !== '') {
            queryConditions.push({ email: user.email });
        }

        let memberProfile = await mongoose.connection.collection('ubc20252026').findOne({
            $or: queryConditions
        });

        if (memberProfile) {
            return res.json({
                ...memberProfile,
                hoVaTen: memberProfile.hoVaTen || memberProfile['Họ và tên'] || user.username || '',
                msv: memberProfile.msv || memberProfile['Mã SV'] || user.msv || '',
                email: memberProfile.email || user.email || ''
            });
        }

        // Nếu chưa có profile chi tiết, trả về thông tin cơ bản từ user (KHÔNG BÁO LỖI 404 NỮA)
        return res.json({
            userId: userId,
            hoVaTen: user.username || user.hoVaTen || '',
            msv: user.msv || '',
            email: user.email || '',
            ban: '',
            khoa: '',
            nganh: '',
            lop: '',
            ngaySinh: '',
            que: '',
            facebook: '',
            anhThe: ''
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

        const cleanMsv = msv ? String(msv).trim() : (user.msv || '');

        // Dữ liệu chuẩn hóa không dấu gọn gàng
        const updateData = {
            userId: userId,
            hoVaTen: hoVaTen || '',
            msv: cleanMsv,
            ban: ban || '',
            khoa: khoa || '',
            nganh: nganh || '',
            lop: lop || '',
            ngaySinh: ngaySinh || '',
            que: que || '',
            facebook: facebook || '',
            email: user.email || ''
        };

        if (req.file) {
            updateData.anhThe = `/uploads/${req.file.filename}`;
        }

        // Điều kiện tìm kiếm bản ghi để cập nhật (ưu tiên tìm theo userId hoặc msv)
        const filterQuery = {
            $or: [
                { userId: userId },
                ...(cleanMsv ? [{ msv: cleanMsv }, { 'Mã SV': cleanMsv }] : []),
                { email: user.email }
            ]
        };

        // Thực hiện cập nhật hoặc tự động tạo mới nếu chưa tồn tại (upsert)
        const result = await mongoose.connection.collection('ubc20252026').findOneAndUpdate(
            filterQuery,
            { $set: updateData },
            { upsert: true, returnDocument: 'after' }
        );

        // Đồng thời cập nhật lại msv và hoVaTen sang bảng users để đồng bộ tuyệt đối
        await mongoose.connection.collection('users').updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: { msv: cleanMsv, hoVaTen: hoVaTen || user.username } }
        );

        const savedDoc = result.value || result;

        res.json({ 
            message: 'Cập nhật thông tin thành công!', 
            user: savedDoc 
        });
    } catch (err) {
        console.error("Lỗi khi cập nhật thông tin:", err);
        res.status(500).json({ message: err.message });
    }
});

// =========================================================================
// 3. ENDPOINT: Dọn dẹp Database ubc20252026 (Xóa sạch key rỗng & trường cũ)
// =========================================================================
router.get('/cleanup-legacy-fields', async (req, res) => {
    try {
        const collection = mongoose.connection.collection('ubc20252026');
        const docs = await collection.find({}).toArray();

        let count = 0;
        for (const doc of docs) {
            const setFields = {};
            const unsetFields = {};

            // Ánh xạ dữ liệu cũ sang tên chuẩn không dấu
            if (doc['Lớp'] && !doc.lop) setFields.lop = doc['Lớp'];
            if (doc['Facebook'] && !doc.facebook) setFields.facebook = doc['Facebook'];
            if (doc['STT'] && !doc.stt) setFields.stt = doc['STT'];
            if (doc['Ban'] && !doc.ban) setFields.ban = doc['Ban'];
            if (doc['Khoa'] && !doc.khoa) setFields.khoa = doc['Khoa'];
            if (doc['Gen'] && !doc.gen) setFields.gen = doc['Gen'];
            if (doc['SĐT'] && !doc.sdt) setFields.sdt = doc['SĐT'];
            if (doc['Mail trường'] && !doc.mailTruong) setFields.mailTruong = doc['Mail trường'];
            if (doc['Cơ sở học cố định'] && !doc.cosoHoc) setFields.cosoHoc = doc['Cơ sở học cố định'];
            if (doc['Ảnh sinh nhật'] && !doc.anhSinhNhat) setFields.anhSinhNhat = doc['Ảnh sinh nhật'];
            if (doc['Mã SV'] && !doc.msv) setFields.msv = doc['Mã SV'];
            if (doc['Họ và tên'] && !doc.hoVaTen) setFields.hoVaTen = doc['Họ và tên'];
            if (doc['Ngày sinh'] && !doc.ngaySinh) setFields.ngaySinh = doc['Ngày sinh'];
            if (doc['Ảnh thẻ'] && !doc.anhThe) setFields.anhThe = doc['Ảnh thẻ'];

            // Danh sách các trường cũ / thừa cần xóa bỏ hoàn toàn
            const fieldsToRemove = [
                'STT', 'Ban', 'Khoa', 'Lop', 'Lớp', 'Gen', 'SĐT', 
                'Nick name zalo', 'Nick name facebook', 'Mail trường', 
                'Cơ sở học cố định', 'Ảnh sinh nhật', 'MSV', 'Mã SV', 'Họ và tên', 
                'Ngày sinh', 'Quê quán', 'Quê', 'Que', 'Ảnh thẻ', 
                'Facebook', ''
            ];

            fieldsToRemove.forEach(field => {
                if (doc.hasOwnProperty(field)) {
                    unsetFields[field] = "";
                }
            });

            const updateQuery = {};
            if (Object.keys(setFields).length > 0) updateQuery.$set = setFields;
            if (Object.keys(unsetFields).length > 0) updateQuery.$unset = unsetFields;

            if (Object.keys(updateQuery).length > 0) {
                await collection.updateOne({ _id: doc._id }, updateQuery);
                count++;
            }
        }

        res.json({ message: `Đã dọn sạch các trường dư thừa cho ${count} bản ghi trong ubc20252026!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;