const User = require('../models/user');

module.exports.profile = function(req, res){
    return res.render('users',{
        username : "Nirbhay",
        title: "profile"
    })
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

}

// sing in and create session 
module.exports.createSession = function(req, res){
    // todo Later 
}