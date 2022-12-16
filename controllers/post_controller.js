const Post = require('../models/post');
const Comment = require('../models/comment');

// we will not convert below line of code async await as there is only 1 callback
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
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error', err);
        return;
    }
}