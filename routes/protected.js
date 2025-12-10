const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Public route
router.get('/public', (req, res) => {
    res.json({ message: 'Công cộng: Ai cũng xem được' });
});

// Protected route (User)
router.get('/profile', protect, (req, res) => {
    res.json({
        message: 'Đã xác thực',
        user: req.user
    });
});

// Protected route (Admin only)
router.get('/admin', protect, admin, (req, res) => {
    res.json({ message: 'Admin Area: Chỉ dành cho VIP', user: req.user });
});

module.exports = router;
