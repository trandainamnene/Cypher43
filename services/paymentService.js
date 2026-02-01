const Payment = require('../models/Payment');
const User = require('../models/User');
const crypto = require('crypto');
// const { SePayPgClient } = require('sepay-pg-node'); // Removed to use manual signing as per docs

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
    console.log('--- SEPAY IPN DATA ---', JSON.stringify(data, null, 2));

    // Handle Order API IPN (Laravel snippet pattern)
    if (data.notification_type === 'ORDER_PAID' && data.order) {
        const invoiceNumber = data.order.order_invoice_number;

        // Find payment by invoiceNumber (or code if previously saved)
        let payment = await Payment.findOne({ invoiceNumber: invoiceNumber });

        if (!payment) {
            // If not found, create new record from Order data
            payment = new Payment({
                gateway: data.order.payment_method || 'OrderAPI',
                transactionDate: new Date(),
                accountNumber: 'N/A',
                content: data.order.order_description || '',
                transferAmount: data.order.order_amount,
                invoiceNumber: invoiceNumber,
                status: 'unprocessed'
            });
        }

        if (payment.status === 'paid' || payment.status === 'processed') {
            return { success: true, message: 'Order already processed' };
        }

        // Identify user from description/content
        const user = await parseUserFromContent(data.order.order_description || '');
        if (user) {
            payment.userId = user._id;
            await upgradeUserPremium(user, data.order.order_amount);
            payment.status = 'paid';
        }

        await payment.save();
        return { success: true };
    }

    // Handle standard Bank Transfer IPN (Original pattern)
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
        invoiceNumber: data.order_invoice_number, // Some integrations send it here
        status: 'unprocessed'
    });

    // Only process incoming transfers
    if (data.transferType === 'in') {
        const user = await parseUserFromContent(data.content);

        if (user) {
            payment.userId = user._id;
            await upgradeUserPremium(user, data.transferAmount);
            payment.status = 'processed';
        } else {
            console.log('No user found for payment content:', data.content);
        }
    }

    await payment.save();
    return { success: true, message: 'Webhook received' };
};

// Helper to avoid duplicate code
const upgradeUserPremium = async (user, amount) => {
    // Determine duration based on amount
    const YEARLY_THRESHOLD = 10000000; // ~10m VND
    const MONTHLY_THRESHOLD = 1000000;  // ~1m VND

    let daysToAdd = 0;
    const transferAmount = Number(amount) || 0;

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
    console.log(`User ${user.email} upgraded to Premium until ${user.premiumEndDate}`);
};

exports.createCheckoutUrl = async (plan, userId) => {
    if (!plan) {
        throw new Error('Plan is required');
    }

    let amount = 0;
    let description = '';

    // Fetch pricing from settings
    const Settings = require('../models/Settings');
    let settings = await Settings.findOne();
    if (!settings) settings = { pricing: { monthly: 49, yearly: 470, exchangeRate: 25000, currency: 'USD' } };

    const pricing = settings.pricing;
    const RATE = pricing.exchangeRate || 25000;

    if (plan === 'monthly') {
        amount = (pricing.monthly || 49) * RATE;
        description = `Thanh toan Premium 1 thang ${userId}`;
    } else if (plan === 'yearly') {
        amount = (pricing.yearly || 470) * RATE;
        description = `Thanh toan Premium 1 nam ${userId}`;
    } else {
        throw new Error('Invalid plan');
    }

    // Initialize SePay credentials from env
    const merchantId = process.env.SEPAY_MERCHANT_ID;
    const secretKey = process.env.SEPAY_SECRET_KEY;
    const endpoint = process.env.NODE_ENV === 'production'
        ? 'https://pay.sepay.vn/v1/checkout/init'
        : 'https://pay-sandbox.sepay.vn/v1/checkout/init';

    // Generate Order ID (Unique)
    const orderId = `P${Date.now()}`;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const params = {
        merchant: merchantId,
        currency: 'VND',
        order_amount: amount,
        operation: 'PURCHASE',
        order_description: description,
        order_invoice_number: orderId,
        customer_id: userId,
        success_url: `${frontendUrl}/payment/success`,
        error_url: `${frontendUrl}/payment/error`,
        cancel_url: `${frontendUrl}/pricing`,
    };

    // Sign the fields
    const signedFieldList = [
        'merchant', 'operation', 'payment_method', 'order_amount', 'currency',
        'order_invoice_number', 'order_description', 'customer_id',
        'success_url', 'error_url', 'cancel_url'
    ];

    const signedData = [];
    for (const field of signedFieldList) {
        if (params[field] !== undefined && params[field] !== null) {
            signedData.push(`${field}=${params[field]}`);
        }
    }

    const signedString = signedData.join(',');
    const signature = crypto.createHmac('sha256', secretKey)
        .update(signedString)
        .digest('base64');

    params.signature = signature;

    // Save pending payment record
    const payment = new Payment({
        gateway: 'SePay',
        transactionDate: new Date(),
        accountNumber: 'N/A',
        content: description,
        transferAmount: amount,
        invoiceNumber: orderId,
        userId: userId,
        status: 'unprocessed'
    });
    await payment.save();

    return {
        checkoutUrl: endpoint,
        params: params,
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

    // Fetch pricing from settings
    const Settings = require('../models/Settings');
    let settings = await Settings.findOne();
    if (!settings) settings = { pricing: { monthly: 49, yearly: 470, exchangeRate: 25000, currency: 'USD' } };

    const pricing = settings.pricing;
    const RATE = pricing.exchangeRate || 25000;

    if (plan === 'monthly') {
        amount = (pricing.monthly || 49) * RATE;
        description = `Thanh toan Premium 1 thang ${userId}`;
    } else if (plan === 'yearly') {
        amount = (pricing.yearly || 470) * RATE;
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
