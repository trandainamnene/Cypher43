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
        required : true,
    },
    features : {
        type : [String]
    },
    idUser : {
        type : [Number]
    }
});

module.exports = mongoose.model('FreeTool', freeToolSchema); 