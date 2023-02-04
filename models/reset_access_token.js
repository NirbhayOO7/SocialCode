const mongoose = require('mongoose');

const resetAccessToken = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    access_token: {
        type : String,
        required: true
    },
    isValid : {
        type: Boolean,
        required : true,
    }
},{
    timestamps: true,
});

const Token = mongoose.model('Token', resetAccessToken);

module.exports = Token;