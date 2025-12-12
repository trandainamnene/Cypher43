const express = require('express');
const router = express.Router();

// Nhập controllers
const testController = require('../controllers/testController');

// Route kiểm thử
router.get('/test', testController.getTest);
router.post('/test', testController.postTest);

// Route kiểm tra sức khỏe
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;

