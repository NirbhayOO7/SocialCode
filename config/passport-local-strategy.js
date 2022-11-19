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

            return done(null, true);
        })
    }
));

// serializing the user to decide which key is to be kept in cookies

passport.serializeUser(function(done, user){
    done(null, user.id);
});

// deserialize the user from the key in the cookies
passport.deserializeUser(function(id, user){
    User.findById(id, function(err, user){
        if(err)
        {
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    })
});

module.exports = passport;