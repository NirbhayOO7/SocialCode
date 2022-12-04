const { now } = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    //we are checking first if post is already present in our database or not as use can fiddle our code by inspecting the html comment form and then changing the post._id
    Post.findById(req.body.post, function(err,post){
        if(err){
            console.log("error in finding post of the comment");
            return;
        }
        if(post){
            Comment.create({
                content:req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                if(err){
                    console.log('Error in finding comment');
                    return;
                }
                
                post.comments.push(comment); //push is a command of mongodb
                post.save(); //save tells the database that this is the final result save it in the database(before saving that data, that data is just present in memory).

                res.redirect('/');
            });
        }
    });
}

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        // not handing the error right now, will do later 

        if(comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}}, function(err, post){
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    });
}