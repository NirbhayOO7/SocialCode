const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

const env = require('./environment');
const googelStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto'); // crypto is used to generate random password for the newly created user although we do not use 
// this credentails for login.
const User = require('../models/user');


// tell passport to use a new strategy for google login 
passport.use(new googelStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },
    // get the clientId, clientSecret and callbackURL from the new created project in console.cloud.google.com
    function(accessToken, refreshToken, profile, done){

        // accessToken is similar to JWT token which will sent by google to our Server and refreshToken is the token will sent
        // to get the new accessToken if already existed accessToken is expired
        // Profile will contains the user information which is saved in google for that user 

        User.findOne({email: profile.emails[0].value}, function(err, user){
            if(err){console.log("error in google-strategy passport", err); return;}

            // console.log(profile);

            if(user){
                // if user is found the set this user to req.user(below line will do this.) 
                return done(null, user);
            }
            else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){console.log("error in creating user google-auth", err); return;}

                    return done(null, user);
                })
            }
        })
    }
))

module.exports = passport;