const express = require('express');

const passport = require('passport');
const { OAuthStrategy } = require('passport-google-oauth');

const router = express.Router();

const userController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);
router.post('/create', userController.create);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
    ),userController.createSession);

router.get('/sign-out',userController.destroySession);
router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']})); // this call will sent the call to google for users vefication.
//scope defines the data which we want from google to return after user verfication is done from google server.
router.get('/auth/google/callback', passport.authenticate(
    'google',
     {failureRedirect: '/users/sign-in'}
     ), userController.createSession);
// once user account is verfied by using the call for "router.get('/auth/google')", then google will call the callback url('/auth/google/callback')
// menitioned in line above, then we will use our passport-google-out-strategy to check whether user is verfied or not using google
// account

router.get('/forgot-password', userController.forgotPassword);

router.post('/reset-password', userController.resetPassword);

router.get('/change-password-link/:id', userController.changePasswordLink);

router.post('/submit-password-change/:id', userController.submitChangePassword);

module.exports = router;