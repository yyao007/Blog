const Blog = require('../models/blog');

exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
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
