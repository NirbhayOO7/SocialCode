const User = require('../models/user');
const Token = require('../models/reset_access_token');
const Friendship = require('../models/friendship');
const crypto = require('crypto');
const queue = require('../config/kue');
const accessTokenEmailWorker = require('../workers/access_token_email_worker');
const resertPasswordMailer = require('../mailers/resetpassword_mailer');
const path = require('path');

const fs = require('fs');

// module.exports.profile = function(req, res){
//     User.findById(req.params.id, function(err, user){
//         return res.render('users',{
//             title: "User profile",
//             profile_user: user
//         });
//     });
// };

// profile function using async await 

module.exports.profile = async function(req, res){

    let user = await User.findById(req.params.id).populate('friendships');

    let friends = user.friendships;

    let isFriend = false;

    friends.forEach(element => {
        if(element.to_user._id == req.user.id){
            isFriend = true;
        }
    });

    return res.render('users', {
        title: `${user.name} profile`,
        profile_user: user,
        isFriend: isFriend
    });
};

// render signIn page 
module.exports.signIn = function(req, res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    // console.log('sign-in', req.user);
    return res.render('user_sign_in', {
        title: 'SocailCode | Sign In'
    });
};

// render signUp page 
module.exports.signUp = function(req, res){
    // req.isAuthenticated is functionality of passport module 
    if(req.isAuthenticated()) 
    {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: 'SocailCode | Sign Un'
    });
};

// get the sign up data 
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password)
    {
        req.flash('error', 'password and confirm password does not match!');
        return res.redirect('back');
    }

    // findOne function will find an email in our database collection with email req.body.email and if found that document will be repersent by user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            req.flash('error', err);
            console.log('Error in finding user in signing up'); 
            return res.redirect('back');
        }

        if(!user)
        {
            User.create(req.body, function(err, user){
                if(err)
                {
                    req.flash('error', err);
                    console.log('Error creating user while signing up'); 
                    return res.redirect('back');
                }

                req.flash('success', 'User Id created!');
                return res.redirect('/users/sign-in');
            })
        }
        else
        {
            req.flash('error', 'Email already registered!');
            return res.redirect('back');
        }
    });

}

// sing in and create session 
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully');
    // console.log('createSession req.user', req.user);
    return res.redirect('/');
}

//log-out of session
module.exports.destroySession = function(req, res){
    // req.logout is a function of passport js 
    req.logout(function(err){
        if(err){
            console.log('Error while logging out of the session')
        }

        req.flash('success', 'You have logged out!')
        return res.redirect('/');
    });
}

// to update user info if user is loged in 
// module.exports.update = function(req, res){

//     if(req.user.id == req.params.id){

//         User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
//             req.flash('success', 'User profile updated!');
//             return res.redirect('back');
//         });
//     }else{
//         return res.status(401).send('Unauthorized');
//     }
// }


// we will use async-await function for update

module.exports.update = async function(req, res){

    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            // since now the enctype is multipart/form-data, we will not be able to access the body of form data directly by req.body 
            // we will have to take the help of multer module functions 

            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('****Multer error: ', err)}

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){ // since user have freedom to either upload the avatar or not, so we check if user have uploaded a file or not
                    
                    if(user.avatar && fs.existsSync(path.join(__dirname , '..' , user.avatar))){
                        fs.unlinkSync(path.join(__dirname , '..' , user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                req.flash('success', 'profile updated!')
                return res.redirect('back');
            })
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// below action would take place once user click on forgot/reset password 
module.exports.forgotPassword = function(req, res){
    return res.render('user_forgot_password', {
        title: 'SocailCode | Reset-Password'
    });
}

// once user submit the request for changing password by mentioning his email id, then take below action and create token and send mail to user with link attached in email.
module.exports.resetPassword = async function(req, res){

    try{

        let user = await User.findOne({email: req.body.email});

        if(user){

            let accessToken = await Token.create({
                user: user._id,
                access_token: crypto.randomBytes(20).toString('hex'),
                isValid: true
            });

            accessToken = await accessToken.populate([{path:'user', select:'name email'}]);

            // console.log('accessToken',accessToken);

            let job = queue.create('email_access_token', accessToken).save(function(err){
                if(err){
                    console.log('Error in emails jobs to the queue', err);
                }

                console.log('job enqueued', job.id);
            });

            req.flash('success', 'Please check your mail to reset password');

            return res.redirect('/');
        }
        else{
            req.flash('error', 'email id does not exist');
            // console.log('inside resetPassword');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        console.log('Error', err);
        return res.redirect('back');
    }
}

// once user click on the the link which was sent on his mail to change password, below action would happen 
module.exports.changePasswordLink = async function(req, res){

    try{
        let accessToken = await Token.findOne({access_token: req.params.id});
            // console.log('access token', accessToken);
            return res.render('change_password_page',{
                title: 'Change your password',
                accessToken: accessToken
        });
    }catch(err){
        req.flash('error',err);
        console.log('Error', err);
        return res.redirect('back');
    }
}


// once user submit the new password with confirm password below action would take place 
module.exports.submitChangePassword = async function(req, res){
    
    try{
        // console.log('Under submit password change');
        if(req.body.password == req.body.confirm_password){

            // console.log('Under submit password change and password and confirm password matched');
            let accessToken = await Token.findOne({access_token: req.params.id}).populate('user');

            // console.log(accessToken);
            if(accessToken.isValid){
                accessToken.user.password = req.body.password;

                accessToken.isValid = false;
                accessToken.user.save();
                accessToken.save();

                // console.log('user password and access token modified',accessToken);
                req.flash('success', 'Password changed successfully');
                return res.redirect('/users/sign-in');
            }
        }
        else{
            req.flash('error', 'password and confirm password does not match');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error',err);
        console.log('Error', err);
        return res.redirect('back');
    }

}

// to add user to friends list 
module.exports.addFriend = async function(req, res){
    
    try{
        console.log('Inside user controller add friend');

        let friend1 = await Friendship.create({
            from_user: req.user.id,
            to_user: req.params.id
        });

        let friend2 = await Friendship.create({
            from_user: req.params.id,
            to_user: req.user.id
        });

        let from_user = await User.findById(req.user.id);
        let to_user = await User.findById(req.params.id);

        // console.log(from_user);
        from_user.friendships.push(friend1);
        from_user.save();
        to_user.friendships.push(friend2);
        to_user.save();

        return res.redirect('back');

    }catch(err){
        req.flash('error',err);
        console.log('Error', err);
        return res.redirect('back');
    }
    
};

// to remove user from friend list 
module.exports.removeFriend = async function(req, res){

    try{
        console.log('Inside user controller remove friends');

        let friend1 = await Friendship.findOneAndRemove({
            from_user: req.user.id,
            to_user: req.params.id
        });

        let friend2 = await Friendship.findOneAndRemove({
            from_user: req.params.id,
            to_user: req.user.id
        });

        await User.findByIdAndUpdate(req.user.id, {$pull: {friendships: friend1._id}});
        await User.findByIdAndUpdate(req.params.id, {$pull: {friendships: friend2._id}});

        return res.redirect('back');

    }catch(err){
        req.flash('error',err);
        console.log('Error', err);
        return res.redirect('back');
    }
}