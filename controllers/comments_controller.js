const { now } = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');

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

            comment.remove();

            await Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}});
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