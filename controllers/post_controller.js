const Post = require('../models/post');
const Comment = require('../models/comment');
const test = require('../config/middleware')
const Like = require('../models/like');

// we will not convert below line of code async await as there is only 1 callback
module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content : req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                user: req.user.name,
                message: "post created!"
            });
        }
            
        req.flash('success', 'Your post is published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        console.log('Error', err);
        return res.redirect('back');
    }
}

// module.exports.destroy = function(req, res){
//     Post.findById(req.params.id, function(err, post){ // req.params contains the query params send by anchor tag.
//         if(err){
//             console.log("Error in finding post to destroy it");
//             return;
//         }

//         //.id means converting the object id into strings(_id is not in string format, that why mongoose db gives us a mehtod id)
//         if(post.user == req.user.id){
//             post.remove();

//             Comment.deleteMany({post: req.params.id}, function(err){
//                 if(err){
//                     console.log('Error in deleting the Comments on a post');
//                     return;
//                 }

//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         }
//     });
// }

// converting the destroy code written above to async await to avoid callback hell 

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            // console.log({$in: post.comments});
            await Like.deleteMany({likeable: {$in: post.comments}, onModel: 'Comment'});
            // $in is used to send the array of values, so $in: post.comments will send the _id(as post.commensts and post.commensts._id both are same) of all the comments made on the post.
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id : req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log('Error', err);
        return res.redirect('back');
    }
}