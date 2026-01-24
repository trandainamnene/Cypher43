const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Webhook endpoint for SePay
// SePay will POST to this URL
router.post('/sepay-webhook', paymentController.sepayWebhook);

module.exports = router;
