const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Webhook endpoint for SePay
router.post('/ipn', paymentController.sepayWebhook);

// Create checkout link
router.post('/create-checkout-url', paymentController.createCheckoutUrl);

module.exports = router;
