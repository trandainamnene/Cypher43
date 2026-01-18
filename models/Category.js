const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['airdrop', 'news', 'tool'],
        default: 'airdrop'
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
