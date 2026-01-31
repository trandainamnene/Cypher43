const paymentService = require('../services/paymentService');

exports.sepayWebhook = async (req, res) => {
    try {
        const data = req.body;
        console.log('--- SEPAY WEBHOOK RECEIVED ---');
        console.log(data);

        const result = await paymentService.processedWebhook(data);

        res.status(200).json(result);
    } catch (error) {
        console.error('SePay Webhook Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.createCheckoutUrl = async (req, res) => {
    try {
        const { plan, userId } = req.body; // plan: 'monthly' or 'yearly'

        const result = await paymentService.createCheckoutUrl(plan, userId);

        res.json({
            success: true,
            ...result
        });

    } catch (err) {
        console.error("Create Checkout Error:", err);
        const status = err.message === 'Plan is required' || err.message === 'Invalid plan' ? 400 : 500;
        res.status(status).json({ success: false, message: err.message });
    }
};

exports.getPaymentInfo = async (req, res) => {
    try {
        const { plan, userId } = req.body;
        const result = await paymentService.getPaymentInfo(plan, userId);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error("Get Payment Info Error:", err);
        const status = err.message === 'Plan is required' || err.message === 'Invalid plan' ? 400 : 500;
        res.status(status).json({ success: false, message: err.message });
    }
};

exports.handleSuccess = (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/payment/success`);
};

exports.handleError = (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/payment/error`);
};

exports.handleCancel = (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/pricing`);
};
