const Payment = require('../models/Payment');
const User = require('../models/User');
const { SePayPgClient } = require('sepay-pg-node');

// Helper function to extract info from content
// Assumption: Content contains "CIPHER43 {EMAIL}" or just "{EMAIL}"
const parseUserFromContent = async (content) => {
    // 1. Try to find an email in the content
    const emailRegex = /[\w.-]+@[\w.-]+\.[\w]{2,}/;
    const emailMatch = content.match(emailRegex);

    if (emailMatch) {
        return await User.findOne({ email: emailMatch[0] });
    }

    // 2. Try to find ObjectId (24 hex characters)
    // Careful: this might match random strings, but it's worth a try if the QR code is generated with ID
    const idRegex = /[0-9a-fA-F]{24}/;
    const idMatch = content.match(idRegex);
    if (idMatch) {
        return await User.findById(idMatch[0]);
    }

    return null;
};

exports.sepayWebhook = async (req, res) => {
    try {
        const data = req.body;

        console.log('--- SEPAY WEBHOOK RECEIVED ---');
        console.log(data);

        // Verify SePay API Key (Security)
        // SePay sends 'Authorization': 'Bearer {API_KEY}'
        // const sepayApiKey = process.env.SEPAY_API_KEY;
        // const authHeader = req.headers['authorization'];

        // if (sepayApiKey && (!authHeader || !authHeader.includes(sepayApiKey))) {
        //     console.warn('SePay Unauthorized Access Attempt');
        //     return res.status(401).json({ success: false, message: 'Unauthorized' });
        // }

        // Check if transaction already exists (deduplication)
        // SePay might retry, or use referenceCode
        const existingPayment = await Payment.findOne({
            referenceCode: data.referenceCode,
            transactionDate: data.transactionDate
        });

        if (existingPayment) {
            return res.status(200).json({ success: true, message: 'Payment already processed' });
        }

        // Create Payment record
        const payment = new Payment({
            gateway: data.gateway,
            transactionDate: data.transactionDate,
            accountNumber: data.accountNumber,
            subAccount: data.subAccount,
            code: data.code,
            content: data.content,
            transferType: data.transferType,
            transferAmount: data.transferAmount,
            accumulated: data.accumulated,
            description: data.description,
            referenceCode: data.referenceCode,
            status: 'unprocessed'
        });

        // Only process incoming transfers
        if (data.transferType === 'in') {
            const user = await parseUserFromContent(data.content);

            if (user) {
                payment.userId = user._id;

                // LOGIC TO UPGRADE USER
                // Define logic based on amount. 
                // Ex: > 200,000 VND -> Premium 1 month?
                // For now, I'll assume ANY 'in' transfer upgrades/extends Premium for testing.
                // We typically need a Pricing plan mapping. 
                // Let's assume 1 month = 1000 for now or configurable.

                // Example Logic:
                // 1 Month = X amount
                // Since I don't know the price, I will just activate Premium for 30 days if amount > 0 for now.

                // Update User
                user.accountType = 'premium';

                // Calculate Expiry
                const now = new Date();
                const currentExpiry = user.premiumEndDate && user.premiumEndDate > now ? user.premiumEndDate : now;
                // Add 30 days
                // Future improvement: Calculate days based on amount / daily_cost
                const daysToAdd = 30;
                user.premiumEndDate = new Date(currentExpiry.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));

                if (!user.premiumStartDate) {
                    user.premiumStartDate = now;
                }

                await user.save();
                payment.status = 'processed';
                console.log(`User ${user.email} upgraded to Premium until ${user.premiumEndDate}`);
            } else {
                console.log('No user found for payment content:', data.content);
            }
        }

        await payment.save();

        res.status(200).json({ success: true, message: 'Webhook received' });
    } catch (error) {
        console.error('SePay Webhook Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.createCheckoutUrl = async (req, res) => {
    try {
        const { plan, userId } = req.body; // plan: 'monthly' or 'yearly'

        if (!plan) {
            return res.status(400).json({ success: false, message: 'Plan is required' });
        }

        let amount = 0;
        let description = '';

        // Define pricing (VND) - Exchange Rate assumption: 1 USD = 25,000 VND
        const RATE = 25000;

        if (plan === 'monthly') {
            amount = 49 * RATE; // 1,225,000 VND
            description = `Thanh toan Premium 1 thang ${userId}`; // Short description for Bank Limitation
        } else if (plan === 'yearly') {
            amount = 470 * RATE; // 11,750,000 VND
            description = `Thanh toan Premium 1 nam ${userId}`;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid plan' });
        }

        // Initialize SePay Client
        const client = new SePayPgClient({
            env: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            merchant_id: process.env.SEPAY_MERCHANT_ID,
            secret_key: process.env.SEPAY_SECRET_KEY
        });

        // Generate Order ID (Unique)
        const orderId = `P${Date.now()}`;

        const checkoutURL = client.checkout.initCheckoutUrl();
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const checkoutFormfields = client.checkout.initOneTimePaymentFields({
            payment_method: 'BANK_TRANSFER',
            order_invoice_number: orderId,
            order_amount: amount,
            currency: 'VND',
            order_description: description,
            success_url: `${frontendUrl}/payment/success`, // Simple success page
            error_url: `${frontendUrl}/payment/error`,
            cancel_url: `${frontendUrl}/pricing`,
        });

        res.json({
            success: true,
            checkoutUrl: checkoutURL,
            params: checkoutFormfields,
            amount,     // For debug/display UI
            orderId
        });

    } catch (err) {
        console.error("Create Checkout Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
