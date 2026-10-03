import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'ubc20252026' });
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'ubc20252026');

router.get('/', async (req, res) => {
  try {
    const rawUsers = await User.find({});
    console.log(`🔥 Đã lấy thành công ${rawUsers.length} thành viên từ collection ubc20252026`);

    // Map chuẩn xác các trường từ MongoDB sang định dạng Frontend yêu cầu
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
        nicknameFacebook: u['Nick name facebook'] || u['Nickname Facebook'] || u.nicknameFacebook || '',
        mailTruong: u['Mail trường'] || u['Email trường'] || u.mailTruong || '',
        cosoHoc: u['Cơ sở học cố định'] || u['Cơ sở học'] || u.cosoHoc || '',
        que: u['Quê'] || u['Quê quán'] || u.que || 'Chưa cập nhật',
        anhThe: u['Ảnh thẻ'] || u.anhThe || '',
        anhSinhNhat: u['Ảnh sinh nhật'] || u.anhSinhNhat || ''
      };
    });

    res.json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;