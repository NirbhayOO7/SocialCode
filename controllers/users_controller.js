const User = require('../models/user');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('users',{
            title: "User profile",
            profile_user: user
        });
    });
};

// render signIn page 
module.exports.signIn = function(req, res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

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
module.exports.update = function(req, res){

    if(req.user.id == req.params.id){

        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            req.flash('success', 'User profile updated!');
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorized');
    }
}