const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Webhook endpoint for SePay
router.post('/ipn', paymentController.sepayWebhook);

// Create checkout link
router.post('/create-checkout-url', paymentController.createCheckoutUrl);

// Get Payment Info for QR
router.post('/info', paymentController.getPaymentInfo);

module.exports = router;
