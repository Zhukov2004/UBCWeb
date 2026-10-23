import express from 'express';
import Shift from '../models/Shift.js';

const router = express.Router();

// 1. Lấy toàn bộ danh sách ca trực
router.get('/', async (req, res) => {
  try {
    const shifts = await Shift.find().sort({ date: 1 });
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Admin tạo ca trực mới
router.post('/create', async (req, res) => {
  try {
    const { date, shiftName, maxSlots, location } = req.body;
    const newShift = new Shift({ date, shiftName, maxSlots, location });
    await newShift.save();
    res.status(201).json(newShift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Thành viên gửi đăng ký nguyện vọng ca trực
router.post('/register', async (req, res) => {
  const { shiftId, userId, msv, hoVaTen } = req.body;
  try {
    const shift = await Shift.findById(shiftId);
    if (!shift) return res.status(404).json({ message: 'Không tìm thấy ca trực' });

    // Kiểm tra xem đã đăng ký nguyện vọng chưa
    const alreadyRequested = shift.requests.some(r => r.msv === msv);
    const alreadyAssigned = shift.assignedStaff.some(a => a.msv === msv);
    
    if (alreadyRequested || alreadyAssigned) {
      return res.status(400).json({ message: 'Bạn đã đăng ký hoặc đã được phân công ca này rồi!' });
    }

    shift.requests.push({ userId, msv, hoVaTen });
    await shift.save();
    res.json({ message: 'Đăng ký nguyện vọng thành công! Chờ Admin phê duyệt.', shift });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Admin Phân công thành viên vào ca (Duyệt nguyện vọng hoặc thêm trực tiếp)
router.post('/assign', async (req, res) => {
  const { shiftId, userId, msv, hoVaTen } = req.body;
  try {
    const shift = await Shift.findById(shiftId);
    if (!shift) return res.status(404).json({ message: 'Không tìm thấy ca trực' });

    // Kiểm tra xem đã nằm trong danh sách phân công chưa
    if (shift.assignedStaff.some(a => a.msv === msv)) {
      return res.status(400).json({ message: 'Thành viên này đã có trong danh sách phân công!' });
    }

    // Thêm vào danh sách chính thức
    shift.assignedStaff.push({ userId, msv, hoVaTen, status: 'Đã phân công' });

    // Xóa khỏi danh sách chờ (requests) nếu có đăng ký từ trước
    shift.requests = shift.requests.filter(r => r.msv !== msv);

    await shift.save();
    res.json({ message: 'Phân công thành công!', shift });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Admin điểm danh (Đã đến / Vắng mặt) hoặc Xóa khỏi ca phân công
router.put('/update-status', async (req, res) => {
  const { shiftId, staffId, status } = req.body; // status: 'Đã đến', 'Vắng mặt', hoặc 'remove'
  try {
    const shift = await Shift.findById(shiftId);
    if (!shift) return res.status(404).json({ message: 'Không tìm thấy ca trực' });

    if (status === 'remove') {
      shift.assignedStaff = shift.assignedStaff.filter(a => String(a._id) !== String(staffId));
    } else {
      const staff = shift.assignedStaff.id(staffId);
      if (staff) staff.status = status;
    }

    await shift.save();
    res.json({ message: 'Cập nhật trạng thái thành công', shift });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;