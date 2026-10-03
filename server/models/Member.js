import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  stt: { type: String, alias: 'STT' },
  msv: { type: String, required: true, unique: true, alias: 'Mã SV' },
  ban: { type: String, alias: 'Ban' },
  ngaySinh: { type: String, alias: 'Ngày sinh' },
  khoa: { type: String, alias: 'Khoa' },
  lop: { type: String, alias: 'Lớp' },
  gen: { type: String, alias: 'Gen' },
  nicknameZalo: { type: String, alias: 'Nick name zalo' },
  facebook: { type: String, alias: 'Facebook' },
  nicknameFacebook: { type: String, alias: 'Nick name facebook' },
  mailTruong: { type: String, alias: 'Mail trường' },
  cosoHoc: { type: String, alias: 'Cơ sở học cố định' },
  que: { type: String, alias: 'Quê' },
  anhSinhNhat: { type: String, alias: 'Ảnh sinh nhật' },
  anhThe: { type: String, alias: 'Ảnh thẻ' },
  hoVaTen: { type: String, alias: 'Họ và tên' }
}, { timestamps: true });

// Trỏ thẳng vào collection 'ubc20252026' của bạn
const Member = mongoose.model('Member', memberSchema, 'ubc20252026');

export default Member;