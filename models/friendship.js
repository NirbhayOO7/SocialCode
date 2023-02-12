const mongoose = require('mongoose');

const friedshipSchema = new mongoose.Schema({
    
    // the user who sents the friend request 
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    // the user who accepted this request, the naming is just to understand, otherwise, the user won't see the difference.
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const Friendship = mongoose.model('Friendship', friedshipSchema);

module.exports = Friendship;

