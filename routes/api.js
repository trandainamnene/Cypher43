const express = require('express');
const router = express.Router();

// Import controllers
const testController = require('../controllers/testController');

// Test route
router.get('/test', testController.getTest);
router.post('/test', testController.postTest);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;

