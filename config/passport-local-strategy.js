// install the passport module to use passport 
const passport = require('passport');

// see in-depth process flow of authentication process using passport js : http://toon.io/understanding-passportjs-authentication-flow/

// install the passport-local module to use passport-local 
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


//authenticate using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true       // this variable is defined so that we can pass a req variable to below callback funtion or else normally below callback function does not have access to req variable.
    },

    // find the user and establish the authenticity
    function(req, email, password, done)
    {
        // console.log('********Passport-local*******', req.user);
        User.findOne({email: email}, function(err, user){

            if(err)
            {
                req.flash('error', err)
                // console.log('Error in finding user --> Passport');
                return done(err);
            }

            if(!user || user.password != password)
            {
                req.flash('error', 'Invalid username/password!');
                // console.log('Invalid username/password');
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

// serializing the user to decide which key is to be kept in session-cookies

passport.serializeUser(function(user, done){
    // console.log('********Passport-serialize*******');
    done(null, user._id);
});

// deserialize the user from the key in the session-cookies
passport.deserializeUser(function(id, done){
    // console.log('********Passport-deSerialize*******');
    User.findById(id, function(err, user){
        if(err)
        {
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        // console.log(user.name);
        return done(null, user);
    });
});

passport.checkAuthentication = function(req, res, next){
    // if user is signed in, then pass on the request to the next function(controller's action) 
    // console.log('*****check Authentication**********');
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function(req, res, next){
    // console.log('*****setAuthenticated user**********');
    if(req.isAuthenticated())
    {
        // console.log('*****setting the req.user to locals**********');
        // req.user contains the current signed in user from the session cookie and we are just sending this to locals for the views
        res.locals.user = req.user;

        // the user key inside the req variable is created with the help of passport module, once the user is verified using the done callback function mentioned in line 37.
    }
    
    next();
};

module.exports = passport;