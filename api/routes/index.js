const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');
const jwt = require('jsonwebtoken');
const opts = require('../../verification');

let router = express.Router();

router.get('/', function(req, res) {
    res.json({'success': true, 'message': 'Welcome to the BLOG API! Try GET /blogs to start.'});
});

// Create new user
router.post('/register', middleware.needLogIn, function(req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            // console.log(err);
            return res.json({'success': false, 'message': err.message});
        } else {
            return res.status(201).json({'success': true, 'message': 'Created user successfully!'});
        }
    });
});

// Log in user
router.post('/login', middleware.needLogIn, function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.json({'success': false, 'message': err});
        }
        if (!user) {
            return res.json({'success': false, 'message': info});
        } else {
            let payload = {id: user.id, hash: user.hash};
            let token = jwt.sign(payload, opts.secretOrKey, {
                issuer: opts.issuer,
                expiresIn: '10h',
            });
            return res.json({
                'success': true,
                'data': {
                    'user': {
                        'id': user._id,
                        'username': user.username,
                        'group': user.group,
                    },
                },
                'token': token,
            });
        }
    })(req, res, next);
});

// Logout route
router.get('/logout', function(req, res) {
    res.json({'success': true, 'message': 'Logged out successfully'});
});

module.exports = router;
