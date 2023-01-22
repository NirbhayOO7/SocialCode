const express = require('express');
const passport = require('passport');

const router = express.Router();

const postApi = require('../../../controllers/api/v1/post_api');

router.get('/', postApi.index);
router.delete('/:id',passport.authenticate('jwt', {session: false}), postApi.destroy); //session value is set to false so that the 
//data would not be saved in session cookies.
// passport.authenticate will call the passport-jwt-strategy and then user info will be extracted from the jwt, which was set during login(create-session)
module.exports = router;