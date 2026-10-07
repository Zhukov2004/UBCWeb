const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
// Giả định bạn có middleware xác thực admin, thay thế bằng middleware thực tế của bạn
// const verifyAdmin = require('../middleware/verifyAdmin'); 

// 1. Lấy danh sách toàn bộ Account
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find({}).select('-matKhau');
    res.status(200).json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi tải danh sách account' });
  }
});

// 2. Thay đổi quyền (Role) của Account
router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role không hợp lệ!' });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-matKhau');

    if (!updatedAccount) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
    }

    res.status(200).json(updatedAccount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật quyền' });
  }
});

// 3. Xóa Account
router.delete('/:id', async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    if (!deletedAccount) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản để xóa!' });
    }
    res.status(200).json({ message: 'Xóa tài khoản thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa tài khoản' });
  }
});

module.exports = router;