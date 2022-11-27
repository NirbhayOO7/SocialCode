const Post = require('../models/post');

module.exports.home = function(req, res){
    // console.log('home controller'+req.user);
    // console.log(req.cookies);
    // res.cookie('user_id',20);
    return res.render('home',{
        title: "Home"
    });
}