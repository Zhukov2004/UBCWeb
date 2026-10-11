import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js'; // Model User quản lý tài khoản

const MONGO_URI = 'mongodb+srv://admin:Pokiwar3@cluster0.h67xs6l.mongodb.net/uneti_book_club?appName=Cluster0'; 

async function importAccountsFromCollection() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('📦 Đã kết nối MongoDB thành công!');

        // 1. Đọc dữ liệu từ collection 'ubc20252026'
        const rawMembers = await mongoose.connection.db.collection('ubc20252026').find({}).toArray();
        console.log(`📊 Tìm thấy ${rawMembers.length} bản ghi trong collection 'ubc20252026'.`);

        let successCount = 0;
        let skippedCount = 0;

        for (const member of rawMembers) {
            const maSV = member["Mã SV"];
            
            // Bỏ qua dòng tiêu đề hoặc dòng không có Mã SV hợp lệ
            if (!maSV || isNaN(Number(maSV))) {
                continue; 
            }

            const maSVStr = String(maSV).trim();
            
            // Lấy và gộp họ tên
            let hoTen = member["hoVaTen"] || member["Họ và tên"];
            if (member["Column4"] && !hoTen?.includes(member["Column4"])) {
                hoTen = `${hoTen || ""} ${member["Column4"]}`.trim();
            }
            hoTen = hoTen || "Thành viên UBC";

            const email = member["Mail trường"] || `${maSVStr.toLowerCase()}@sv.uneti.edu.vn`;

            // 2. Kiểm tra xem tài khoản đã tồn tại theo msv hoặc email chưa
            const existingUser = await User.findOne({ 
                $or: [{ msv: maSVStr }, { email: email }] 
            });

            if (existingUser) {
                skippedCount++;
                continue;
            }

            // 3. Mã hóa Mã SV làm mật khẩu
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(maSVStr, saltRounds);

            // 4. Tạo tài khoản mới (khớp chính xác các trường trong Model User)
            const newUser = new User({
                msv: maSVStr,             // Trường msv bắt buộc theo schema của bạn
                email: email,             
                password: hashedPassword, // Mật khẩu là mã hóa của Mã SV
                hoVaTen: hoTen,           
                role: 'user'              
            });

            await newUser.save();
            console.log(`✅ Đã tạo tài khoản: Mã SV ${maSVStr} - ${hoTen}`);
            successCount++;
        }

        console.log('--------------------------------------------------');
        console.log(`🎉 Hoàn tất! Tạo thành công: ${successCount} tài khoản. Bỏ qua (đã có sẵn): ${skippedCount}`);
        process.exit(0);

    } catch (err) {
        console.error('❌ Lỗi khi import tài khoản từ collection:', err);
        process.exit(1);
    }
}

importAccountsFromCollection();