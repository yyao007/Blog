const Blog = require('../models/blog');
const passport = require('passport');

exports.isLoggedIn = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, function(err, user) {
        if (err) {
            return res.json({'message': 'error', 'error': err});
        }
        if (!user) {
            return res.status(401).json({'message': 'failure', 'error': '401 Unauthorized'});
        } else {
            return next();
        }
    })(req, res, next);
};

exports.hasPermission = function(req, res, next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, function(err, blog) {
            if (err) {
                res.redirect('back');
            } else {
                if (req.user.group === 'admin' || blog.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'Please login first!');
        res.redirect('back');
    }
};

exports.needLogIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        req.flash('error', 'You have already logged in');
        return res.redirect('/blogs');
    }
    return next();
};
