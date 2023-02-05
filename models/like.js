const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // this defines the object id of the liked object 
    likeable:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'         // refPath is used to dynamically assign the type to likeable key.
        // so what refPath does here is defines that the type of likeable key is can either be of Post or Comment which is mentioned below key-value of onModel-enum.
        // the value will be the object id of either Post or Comment which will decided dynamically. 
    },

    // this field is used for defining the type of like object since this is a dynamic reference 
    onModel:{
        type : String,
        required: true,
        enum: ['Post', 'Comment']
    }
},{
    timestamps: true
}
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;