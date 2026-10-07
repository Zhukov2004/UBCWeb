const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  hoVaTen: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  matKhau: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true // Tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('Account', accountSchema);