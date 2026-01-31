const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Live', 'Ended'],
        default: 'Live',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    shortNamme: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    keyRequirements: {
        type: [String]
    },
    supportChian: {
        type: [String]
    },
    price: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true,
    },
    totalRaise: {
        type: Number,
        required: true,
    },
    backers: {
        type: Number,
        required: true,
    },
    deadline: {
        type: Date,
        required: false,
    },
    networkd: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    supportNetworks: {
        type: [String],
        default: []
    },
    featuredBackers: {
        type: [String],
        default: []
    },
    guide: {
        type: String, // Step-by-Step Guide in HTML format
        default: ''
    },
    potential: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    image: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    discord: {
        type: String,
        default: ''
    },
    gitbook: {
        type: String,
        default: ''
    },
    telegram: {
        type: String,
        default: ''
    },
    updates: [{
        title: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Product', productSchema);