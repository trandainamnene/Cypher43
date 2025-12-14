const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    features : {
        type : [String]
    }
});

module.exports = mongoose.model('Benefit', benefitSchema); 