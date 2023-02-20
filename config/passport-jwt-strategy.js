const passport = require('passport');
const env = require('./environment');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt; // this method is used to Extract jwt info from request.

const User = require('../models/user');

let opts ={
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),     // creates a new extractor that looks for the JWT in the authorization header with the scheme 'bearer'
    secretOrKey : env.jwt_secret          // we will kep this value same as the key which we have used to encrypt the JWT while making it in createSession using jwt.sign function.
};

passport.use(new JWTStrategy(opts, function(jwtPayload, done){
    User.findById(jwtPayload._id, function(err, user){
        if(err){
            console.log('Error in finding user from JWT');
            return;
        }

        if(user)
        {
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
}))

module.exports = passport;