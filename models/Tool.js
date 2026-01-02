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
    }
});

module.exports = mongoose.model('Tool', ToolSchema); 