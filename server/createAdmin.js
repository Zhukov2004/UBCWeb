import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdminAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối MongoDB để tạo tài khoản admin...');

    // Kiểm tra xem MSV admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ msv: '22203100014' });
    if (existingAdmin) {
      console.log('⚠️ Tài khoản admin (22203100014) đã tồn tại trong database rồi!');
      process.exit(0);
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const adminUser = new User({
      hoVaTen: 'Quản Trị Viên UBC',
      msv: '22203100014',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('🎉 Tạo tài khoản Admin thành công!');
    console.log('🆔 Mã sinh viên (MSV): 22203100014');
    console.log('🔑 Mật khẩu: 123456');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi tạo tài khoản:', err.message);
    process.exit(1);
  }
};

createAdminAccount();