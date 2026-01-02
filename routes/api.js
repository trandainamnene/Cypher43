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

// Import các routes cho models
router.use('/products', require('./products'));
router.use('/features', require('./features'));
router.use('/benefits', require('./benefits'));
router.use('/tools', require('./tool'));
router.use('/hungtingtiers', require('./hungtingtiers'));
router.use('/auth', require('./auth'));

module.exports = router;

