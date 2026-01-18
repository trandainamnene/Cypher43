const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    features: {
        type: [String]
    },
    idUser: {
        type: [Number]
    },
    type: {
        type: String,
        enum: ['free', 'powerful'],
        default: 'free'
    },
    image: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    howItWorks: {
        type: [String],
        default: []
    },
    useCases: {
        type: [String],
        default: []
    },
    badges: {
        type: [String],
        default: []
    },
    apiLocked: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Tool', ToolSchema); 