const mongoose = require('mongoose');

const hungtingtierSchema = new mongoose.Schema({
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
    price : {
        type : Number,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    features : {
        type : [String]
    },
    limitations : {
        type : [String]
    }
});

module.exports = mongoose.model('HungtingTier', hungtingtierSchema);