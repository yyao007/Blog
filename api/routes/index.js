const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');
const jwt = require('jsonwebtoken');
const opts = require('../../verification');

let router = express.Router();

router.get('/', function(req, res) {
    res.json({message: 'Welcome to the BLOG API! Try GET /blogs to start.'});
});

// Create new user
router.post('/register', middleware.needLogIn, function(req, res) {
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

// Log in user
router.post('/login', middleware.needLogIn, function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.json({'message': 'error', 'error': err});
        }
        if (!user) {
            return res.json({'message': 'failure', 'error': info});
        } else {
            let payload = {id: user.id};
            let token = jwt.sign(payload, opts.secretOrKey, {
                issuer: opts.issuer,
                expiresIn: '24h',
            });
            return res.json({
                'message': 'success',
                'user': {
                    'id': user._id,
                    'username': user.username,
                    'group': user.group,
                },
                'token': token,
            });
        }
    })(req, res, next);
});

// Logout route
router.get('/logout', function(req, res) {
    req.logOut();
    req.flash('success', 'Logged out successfully!');
    res.redirect('/blogs');
});

module.exports = router;
