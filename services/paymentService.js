const Payment = require('../models/Payment');
const User = require('../models/User');
const { SePayPgClient } = require('sepay-pg-node');

// Helper function to extract info from content
const parseUserFromContent = async (content) => {
    // 1. Try to find an email in the content
    const emailRegex = /[\w.-]+@[\w.-]+\.[\w]{2,}/;
    const emailMatch = content.match(emailRegex);

    if (emailMatch) {
        return await User.findOne({ email: emailMatch[0] });
    }

    // 2. Try to find ObjectId (24 hex characters)
    const idRegex = /[0-9a-fA-F]{24}/;
    const idMatch = content.match(idRegex);
    if (idMatch) {
        return await User.findById(idMatch[0]);
    }

    return null;
};

exports.processedWebhook = async (data) => {
    // Check if transaction already exists (deduplication)
    const existingPayment = await Payment.findOne({
        referenceCode: data.referenceCode,
        transactionDate: data.transactionDate
    });

    if (existingPayment) {
        return { success: true, message: 'Payment already processed' };
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

            // Determine duration based on amount
            const YEARLY_THRESHOLD = 10000000; // ~10m VND
            const MONTHLY_THRESHOLD = 1000000;  // ~1m VND

            let daysToAdd = 0;
            const transferAmount = Number(data.transferAmount) || 0;

            if (transferAmount >= YEARLY_THRESHOLD) {
                daysToAdd = 365;
            } else if (transferAmount >= MONTHLY_THRESHOLD) {
                daysToAdd = 30;
            } else {
                daysToAdd = 7;
            }

            // Update User
            user.accountType = 'premium';

            // Calculate Expiry
            const now = new Date();
            let currentExpiry = now;
            if (user.premiumEndDate && !isNaN(new Date(user.premiumEndDate).getTime()) && new Date(user.premiumEndDate) > now) {
                currentExpiry = new Date(user.premiumEndDate);
            }

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
    return { success: true, message: 'Webhook received' };
};

exports.createCheckoutUrl = async (plan, userId) => {
    if (!plan) {
        throw new Error('Plan is required');
    }

    let amount = 0;
    let description = '';

    // Define pricing (VND) - Exchange Rate assumption: 1 USD = 25,000 VND
    const RATE = 25000;

    if (plan === 'monthly') {
        amount = 49 * RATE; // 1,225,000 VND
        description = `Thanh toan Premium 1 thang ${userId}`;
    } else if (plan === 'yearly') {
        amount = 470 * RATE; // 11,750,000 VND
        description = `Thanh toan Premium 1 nam ${userId}`;
    } else {
        throw new Error('Invalid plan');
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
        success_url: `${frontendUrl}/payment/success`,
        error_url: `${frontendUrl}/payment/error`,
        cancel_url: `${frontendUrl}/pricing`,
    });

    return {
        checkoutUrl: checkoutURL,
        params: checkoutFormfields,
        amount,
        orderId
    };
};

exports.getPaymentInfo = async (plan, userId) => {
    if (!plan) {
        throw new Error('Plan is required');
    }

    let amount = 0;
    let description = '';

    // Define pricing (VND) - Exchange Rate assumption: 1 USD = 25,000 VND
    const RATE = 25000;

    if (plan === 'monthly') {
        amount = 1269000; // 1,225,000 VND
        description = `Thanh toan Premium 1 thang ${userId}`;
    } else if (plan === 'yearly') {
        amount = 470 * RATE; // 11,750,000 VND
        description = `Thanh toan Premium 1 nam ${userId}`;
    } else {
        throw new Error('Invalid plan');
    }

    // Default Bank Info (Should be in env)
    const bankAccount = process.env.SEPAY_BANK_ACCOUNT || 'LOCSPAY000336595';
    const bankName = process.env.SEPAY_BANK_NAME || 'ACB'; // Default or Env
    const accountName = process.env.SEPAY_ACCOUNT_NAME || 'TRUONG VINH HOA';

    return {
        amount,
        description,
        bankAccount,
        bankName,
        accountName
    };
};
