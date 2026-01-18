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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
