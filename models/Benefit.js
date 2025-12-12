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
        reuired : true,
    },
    features : {
        type : [String]
    }
});

exports.module = mongoose.model('Benefit', benefitSchema); 