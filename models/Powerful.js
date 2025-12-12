const mongoose = require('mongoose');

const powerfulSchema = new mongoose.Schema({
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
    isPrivate : {
        type : Boolean,
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

exports.module = mongoose.model('Powerful', powerfulSchema); 