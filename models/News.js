const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    excerpt: {
        type: String,
        maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/800x400'
    },
    author: {
        type: String,
        default: 'Admin'
    },
    authorImage: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    category: {
        type: String,
        default: 'Market Analysis'
    },
    tags: {
        type: [String],
        default: []
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    readTime: {
        type: String,
        default: '5 min'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
