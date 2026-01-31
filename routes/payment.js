const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Webhook endpoint for SePay
router.post('/ipn', paymentController.sepayWebhook);

// Create checkout link
router.post('/create-checkout-url', paymentController.createCheckoutUrl);

// Get Payment Info for QR
router.post('/info', paymentController.getPaymentInfo);

// Callbacks from SePay
router.get('/success', paymentController.handleSuccess);
router.get('/error', paymentController.handleError);
router.get('/cancel', paymentController.handleCancel);

module.exports = router;
