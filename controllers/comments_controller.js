const { now } = require('mongoose');
const Comment = require('../models/comment');
const commentMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Post = require('../models/post');
const Like = require('../models/like');

// module.exports.create = function(req, res){
//     //we are checking first if post is already present in our database or not as user can fiddle our code by inspecting the html comment form and then changing the post._id
//     Post.findById(req.body.post, function(err,post){
//         if(err){
//             console.log("error in finding post of the comment");
//             return;
//         }
//         if(post){
//             Comment.create({
//                 content:req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             }, function(err, comment){
//                 if(err){
//                     console.log('Error in finding comment');
//                     return;
//                 }
                
//                 post.comments.push(comment); //push is a command of mongodb
//                 post.save(); //save tells the database that this is the final result save it in the database(before saving that data, that data is just present in memory).

//                 res.redirect('/');
//             });
//         }
//     });
// }

// module.exports.destroy = function(req, res){
//     Comment.findById(req.params.id, function(err, comment){
//         // not handing the error right now, will do later 

//         if(comment.user == req.user.id){

//             let postId = comment.post;

//             comment.remove();

//             Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}}, function(err, post){
//                 return res.redirect('back');
//             })
//         }else{
//             return res.redirect('back');
//         }
//     });
// }

// above create code was written using callback and there are two callbacks one inside another making callback hell, henc we used asyn-await 
module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content:req.body.content,
                    post: req.body.post,
                    user: req.user._id
            });

            post.comments.push(comment); //push is a command of mongodb
            post.save(); //save tells the database that this is the final result save it in the database(before saving that data, that data is just present in memory).

            // Similar for comments to fetch the user's id!
            comment = await comment.populate([{path:'user', select:'name email'}]);   // this query will populate only the name and email of user not any other field of user. 
            // commentMailer.newComment(comment);

            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('Error in emails jobs to the queue', err);
                }

                console.log('job enqueued', job.id);
            })

            if (req.xhr){
                // console.log('inside comment controller');
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }
            
            req.flash('success','Comment added!');
            return res.redirect('/');   
        }else{
            req.flash('error','Post nod found!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error',err);
        console.log('Error', err);
        return res.redirect('back');
    }
}

// destroy code using async await 

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id)
        // not handing the error right now, will do later 
        if(comment.user == req.user.id){

            let postId = comment.post;

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            comment.remove();

            await Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'comment deleted successfully!');
            return res.redirect('back');
        }else{
            req.flash('error', 'comment not found!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        console.log('Error', err);
        return res.redirect('back');
    }
};