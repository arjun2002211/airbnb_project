const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl, isLoggedin } = require('../middleware.js');
const userController = require('../controllers/user.js');

// // signup form Route
router.route('/signup').get(userController.signupForm).post(wrapAsync(userController.postSignup))

// login route
router.route('/login').get(userController.renderLoginForm).post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, }), userController.postLogin);

router.get('/logout', userController.logout);

module.exports = router;