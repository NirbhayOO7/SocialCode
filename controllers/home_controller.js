const { populate } = require('../models/post');
const Post = require('../models/post');
const User = require('../models/user');

// module.exports.home = function(req, res){
//     console.log('home controller'+req.user);
//     console.log(req.cookies);
//     res.cookie('user_id',20);

//     // populate the user of each post 
//     Post.find({})
//     .populate('user')
//     .populate({                    
//         path: 'comments',  // this is to populate the comments of each post
//         populate: {
//             path: 'user'  // this to populate the user of each comments.
//         }
//     })
//     .exec(function(err, posts){
//         if(err){
//             console.log(err.message);
//             return;
//         }

//         User.find({}, function(err, users){
//             return res.render('home', {
//                 title: "SocialCode | Home",
//                 posts: posts,
//                 all_users: users            // user data is sent to homepage to show list of friends
//             });
//         })
        
//     });

// }

// we can write the above written code using async await 

module.exports.home = async function(req, res){

    try{                                        // try and cath used for error handling.
        let post = await Post.find({})
                        .sort('-createdAt')       //tosort the post acording to createdAt field, recent to oldest
                        .populate('user')
                        .populate({
                            path: 'comments',  // this is to populate the comments of each post
                            populate: {
                                path: 'user'  // this to populate the user of each comments.
                            }
                        });
        
        let users = await User.find({});

        return res.render('home', {
            title: "SocialCode | Home",
            posts: post,
            all_users: users            // user data is sent to homepage to show list of friends
        });
    }catch(err){
        console.log('Error', err);
        return;
    }

}