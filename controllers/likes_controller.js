const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try{

        // path format for likes will be like /likes/toggle/?id=abcd&type=Post

        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // check if like already exist 

        let existingLike = Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // if a like already exists then delete it 
        if(existingLike){
            likeable.likes.pull(existingLike._id);  //pull will remove the like present on either post or comment.
            likeable.save();              // after removing the like we will save the likes key present in Post/Comment by .save()

            existingLike.remove();       //we will also remove that like from the Likes database by .remove().
            deleted = true;              // we will mark that post/comment is not liked now as user clicked again on like which will remove the earlier like(existingLike.remove()).
        }
        else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: "Request successfull",
            data: {
                deleted: deleted
            }
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}