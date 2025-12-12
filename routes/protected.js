const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Route công khai
router.get('/public', (req, res) => {
    res.json({ message: 'Công cộng: Ai cũng xem được' });
});

// Route được bảo vệ (User)
router.get('/profile', protect, (req, res) => {
    res.json({
        message: 'Đã xác thực',
        user: req.user
    });
});

// Route được bảo vệ (Chỉ Admin)
router.get('/admin', protect, admin, (req, res) => {
    res.json({ message: 'Admin Area: Chỉ dành cho VIP', user: req.user });
});

module.exports = router;
