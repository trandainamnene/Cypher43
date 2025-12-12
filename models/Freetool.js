const mongoose = require('mongoose');

const freeToolSchema = new mongoose.Schema({
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
    },
    idUser : {
        type : [Int]
    }
});

exports.module = mongoose.model('FreeTool', freeToolSchema); 