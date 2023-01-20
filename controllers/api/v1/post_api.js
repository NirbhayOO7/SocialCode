const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let post = await Post.find({})
                        .sort('-createdAt')       //to sort the post acording to createdAt field, recent to oldest
                        .populate('user')
                        .populate({
                            path: 'comments',  // this is to populate the comments of each post
                            populate: {
                                path: 'user'  // this to populate the user of each comments.
                            }
                        });

    return res.status(200).json ({
        message: "List of posts",
        posts: post
    });

}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if(req.user.id == post.user)
        {
            post.remove();
        
            await Comment.deleteMany({post: req.params.id});

            return res.status(200).json({
                message: "Post and associated comments deleted"
            });
        }
        else{
            return res.status(401).json({
                message: 'You can not delete this post'
            })
        }
        
    }catch(err){
        console.log('**********', err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}    