const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    status : {
        type : String,
        required: true,
    },
    feature : {
        type : [String],
        default : []
    }
    ,
    name: {
        type: String,
        required: true
    },
    shortNamme : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    keyRequirements : {
        type : [String]
    },
    supportChian : {
        type : [String]
    },
    price: {
        type: Number,
        required: true
    },
    about : {
        type : String,
        required : true,
    },
    toltalRise : {
        type : Number,
        required : true,
    },
    backers : {
        type : Number,
        required : true,
    },
    deadline : {
        type : Date,
        required : true,
    },
    networkd : {
        type : String,
        required : true,
    },
    token : {
        type : String,
        required : true,
    },
    supportNetworks : {
        type : [String],
        default : []
    }
});

module.exports = mongoose.model('Product', productSchema);