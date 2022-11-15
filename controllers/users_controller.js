const User = require('../models/user');

module.exports.profile = function(req, res){
    if(req.cookies.user_id)
    {
        User.findById(req.cookies.user_id, function(err, user){
            if(user)
            {
                return res.render('users',{
                    title: 'User',
                    name: user.name
                });
            }
            else
            {
                return res.redirect('/users/sign-in');
            }
        });
    }
    else
    {
        return res.redirect('/users/sign-in');
    }
};

// render signIn page 
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: 'SocailCode | Sign In'
    });
};

// render signUp page 
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: 'SocailCode | Sign Un'
    });
};

// get the sign up data 
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password)
    {
        return res.redirect('back');
    }

    // findOne function will find an email in our database collection with email req.body.email and if found that document will be repersent by user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding user in signing up'); return;
        }

        if(!user)
        {
            User.create(req.body, function(err, user){
                if(err)
                {
                    console.log('Error creating user while signing up'); return;
                }

                return res.redirect('/users/sign-in');
            })
        }
        else
        {
            return res.redirect('back');
        }
    });

};

// sing in and create session 
module.exports.createSession = function(req, res){

    // find the user whether it existed or not in our db 
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding user in signing in'); return;
        }

        // if we found the user 
        if(user){
            // if password does not match 
            if(user.password != req.body.password)
            {
                return res.redirect('back');
            }

            // if password in matched in db 
            res.cookie('user_id', user.id);

            return res.redirect('/users/profile');
        }
        else
        {
            return res.redirect('back');
        }
    });
};