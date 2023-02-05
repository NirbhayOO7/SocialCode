// this file will manage all the routes request made by the browser

const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller');

console.log("Router loaded");

router.get('/', homeController.home);

// middleware is used to send the request further to users file while we recieve a /users route request 
router.use('/users', require('./users'));
router.use('/post', require('./post'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/api', require('./api'));

module.exports = router;