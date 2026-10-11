import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Hàm tạo model tạm thời trỏ thẳng vào các collection gen2, gen3, gen4 có sẵn của bạn
const getGenModel = (genNumber) => {
    const collectionName = `gen${genNumber}`;
    return mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
};

// API lấy dữ liệu theo từng Gen (ví dụ: /api/gens/2, /api/gens/3, /api/gens/4)
router.get('/:genNum', async (req, res) => {
    try {
        const { genNum } = req.params;
        if (!['2', '3', '4'].includes(genNum)) {
            return res.status(400).json({ message: 'Gen không hợp lệ' });
        }

        const Model = getGenModel(genNum);
        const data = await Model.find({});
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

export default router;