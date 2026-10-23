import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Ngày trực (VD: "2026-11-01")
  shiftName: { type: String, required: true }, // VD: "Ca sáng (08:00 - 11:30)"
  location: { type: String, default: 'Thư viện UNETI' },
  // Đã bỏ trường maxSlots ở đây để không bị giới hạn số lượng
  
  // Danh sách thành viên đăng ký nguyện vọng
  requests: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    msv: String,
    hoVaTen: String,
    registeredAt: { type: Date, default: Date.now }
  }],

  // Danh sách được Admin phân công chính thức
  assignedStaff: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    msv: String,
    hoVaTen: String,
    status: { 
      type: String, 
      enum: ['Đã phân công', 'Đã đến', 'Vắng mặt'], 
      default: 'Đã phân công' 
    },
    assignedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Shift', shiftSchema);