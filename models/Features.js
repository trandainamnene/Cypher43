const mongoose = require('mongoose');

const includesSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    value : {
        type : mongoose.Schema.Types.Mixed,
        required : true,
    },
});

const featuresSchema = new mongoose.Schema({
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
    includes : {
        type : [includesSchema]
    }
});

exports.module = mongoose.model('Features', featuresSchema);