const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res,){
    Post.create({
        content : req.body.content,
        user: req.user._id
    }, function(err, post){
        if(err){
            console.log("Error in creating a post");
            return;
        }
        
        return res.redirect('back');
    });
}

module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){ // req.params contains the query params send by anchor tag.
        if(err){
            console.log("Error in finding post to destroy it");
            return;
        }

        //.id means converting the object id into strings(_id is not in string format, that why mongoose db gives us a mehtod id)
        if(post.user == req.user.id){
            post.remove();

            Comment.deleteMany({post: req.params.id}, function(err){
                if(err){
                    console.log('Error in deleting the Comments on a post');
                    return;
                }

                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });
}