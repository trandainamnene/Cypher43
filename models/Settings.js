const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'Cipher 43 Lab' },
    pageTitle: { type: String, default: 'Cipher 43 Lab - Airdrop & Tool Crypto' },
    logoUrl: { type: String, default: '' },
    footerDescription: { type: String, default: 'Trung tâm tối thượng cho thợ săn airdrop tiền điện tử. Tối đa hóa phần thưởng của bạn với các công cụ hỗ trợ AI.' },
    footerCopyright: { type: String, default: '© 2025 Cipher 43 Lab. Đã đăng ký bản quyền.' },
    socialLinks: {
        twitter: { type: String, default: '' },
        telegram: { type: String, default: '' },
        discord: { type: String, default: '' },
        facebook: { type: String, default: '' },
        youtube: { type: String, default: '' }
    },
    footerLinks: {
        // Product section
        airdrops: { type: String, default: '/opportunities' },
        tools: { type: String, default: '/tools' },
        news: { type: String, default: '/news' },
        pricing: { type: String, default: '/pricing' },
        // Company section
        about: { type: String, default: '#' },
        blog: { type: String, default: '/news' },
        careers: { type: String, default: '#' },
        contact: { type: String, default: '#' },
        // Legal section
        privacyPolicy: { type: String, default: '#' },
        termsOfService: { type: String, default: '#' },
        cookiePolicy: { type: String, default: '#' },
        security: { type: String, default: '#' }
    },
    pricing: {
        monthly: { type: Number, default: 49 },
        yearly: { type: Number, default: 470 },
        currency: { type: String, default: 'USD' },
        exchangeRate: { type: Number, default: 25000 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
