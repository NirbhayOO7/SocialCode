// install the passport module to use passport 
const passport = require('passport');


// install the passport-local module to use passport-local 
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authenticate using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
    },

    // find the user and establish the authenticity
    function(email, password, done)
    {
        User.findOne({email: email}, function(err, user){

            if(err)
            {
                console.log('Error in finding user --> Passport');
                return done(err);
            }

            if(!user || user.password != password)
            {
                console.log('Invalid username/password');
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

// serializing the user to decide which key is to be kept in cookies

passport.serializeUser(function(user, done){
    done(null, user._id);
});

// deserialize the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err)
        {
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        console.log(user.name);
        return done(null, user);
    });
});

passport.checkAuthentication = function(req, res, next){
    // if user is signed in, then pass on the request to the next function(controller's action) 
    if(req.isAuthenticated()){
        return next();
    }
};

passport.setAuthenticatedUser = function(req, res, next){

    if(req.isAuthenticated())
    {
        // req.user contains the current signed in user from the session cookie and we are just sending this to locals for the views
        res.locals.user = req.user;
    }

    next();
};

module.exports = passport;