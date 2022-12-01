const { populate } = require('../models/post');
const Post = require('../models/post');

module.exports.home = function(req, res){
    // console.log('home controller'+req.user);
    // console.log(req.cookies);
    // res.cookie('user_id',20);

    // populate the user of each post 
    Post.find({}).populate('user').exec(function(err, posts){
        if(err){
            console.log(err.message);
            return;
        }
        return res.render('home', {
            title: "SocialCode | Home",
            posts: posts
        });
    });
}