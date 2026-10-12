import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'ubc20252026' });

const UbcMember = mongoose.models.UbcMember || mongoose.model('UbcMember', UserSchema, 'ubc20252026');

// 1. GET: Lấy danh sách
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

// 2. POST: Thêm thành viên mới
router.post('/', async (req, res) => {
  try {
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
      'Ảnh thẻ': req.body.anhThe,
      ...req.body
    };
    const newMember = new UbcMember(newMemberData);
    await newMember.save();
    res.status(201).json({ message: 'Thêm thành viên thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. PUT: Cập nhật thành viên theo ID
router.put('/:id', async (req, res) => {
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
      'Quê': req.body.que,
      'Ảnh thẻ': req.body.anhThe,
      ...req.body
    };

    const updated = await UbcMember.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy thành viên để cập nhật' });
    res.json({ message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE: Xóa thành viên theo ID
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