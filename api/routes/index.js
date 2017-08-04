const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');

let router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/blogs');
});

// Register route
router.get('/register', middleware.needLogIn, function(req, res) {
    res.render('register');
});


// Create new user
router.post('/Register', middleware.needLogIn, function(req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Welcome to BLOG, ' + user.username + '!');
            res.redirect('/blogs');
        });
    });
});

// Log in form route
router.get('/login', middleware.needLogIn, function(req, res) {
    // console.log('Log in route');
    res.render('login');
});

// Log in user
router.post('/login', middleware.needLogIn, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), function(req, res) {
    req.flash('success', 'Welcome back ' + req.user.username + '!');
    res.redirect('/blogs');
});

// Logout route
router.get('/logout', function(req, res) {
    req.logOut();
    req.flash('success', 'Logged out successfully!');
    res.redirect('/blogs');
});

module.exports = router;
