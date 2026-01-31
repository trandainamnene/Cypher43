const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for subscription
router.post('/subscribe', subscriberController.subscribe);

// Admin route to see all subscribers
router.get('/', protect, admin, subscriberController.getAllSubscribers);

module.exports = router;
