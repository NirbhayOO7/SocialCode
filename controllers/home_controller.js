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

    // console.log('home',req.user);   
    try{                                        // try and cath used for error handling.
        let post = await Post.find({})
                        .sort('-createdAt')       //to sort the post acording to createdAt field, recent to oldest
                        .populate('user')
                        .populate({
                            path: 'comments',  // this is to populate the comments of each post
                            populate:{
                                path: 'likes'
                            },
                            populate: {
                                path: 'user'  // this to populate the user of each comments.
                            }
                        }).populate('likes');
        
        let users = await User.find({});
        
        if(req.isAuthenticated())
        {
            let friends = await User.findById(req.user._id).populate({
                path: 'friendships',
                populate:{
                    path:'to_user'
                }
            });

            // console.log(friends.friendships[0].to_user.name);
            return res.render('home', {
                title: "SocialCode | Home",
                posts: post,
                all_users: users,            // user data is sent to homepage to show list of users
                friends: friends.friendships
            });
        }

        return res.render('home', {
            title: "SocialCode | Home",
            posts: post,
            all_users: users,            // user data is sent to homepage to show list of users
        });
    }catch(err){
        console.log('Error', err);
        return;
    }

}