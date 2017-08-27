const express = require('express');
const middleware = require('../middleware');

let router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/blogs');
});

// Register route
router.get('/register', middleware.needLogIn, function(req, res) {
    res.render('register');
});

// Log in form route
router.get('/login', middleware.needLogIn, function(req, res) {
    // console.log('Log in route');
    res.render('login');
});

// Logout route
router.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/blogs');
});

module.exports = router;
