const Blog = require('../models/blog');
const passport = require('passport');

let middleware = {};
middleware.isLoggedIn = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, function(err, user) {
        if (err) {
            return res.json({'success': false, 'message': err});
        }
        if (!user) {
            return res.status(401).json({'success': false, 'message': 'Please log in first!'});
        } else {
            req.user = user;
            return next();
        }
    })(req, res, next);
};

middleware.hasPermission = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, function(err, user) {
        if (err) {
            return res.json({'success': false, 'message': err});
        }
        if (!user) {
            return res.status(401).json({'success': false, 'message': 'Please log in first!'});
        } else {
            req.user = user;
            Blog.findById(req.params.id, function(err, blog) {
                if (err) {
                    console.log(err);
                    return res.json({'success': false, 'message': 'Database error'});
                } else {
                    if (req.user.group === 'admin' || blog.author.id.equals(req.user._id)) {
                        return next();
                    } else {
                        return res.json({'success': false, 'message': 'You don\'t have permission to do that'});
                    }
                }
            });
        }
    })(req, res, next);
};

middleware.needLogIn = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, function(err, user) {
        if (err) {
            return res.json({'success': false, 'message': err});
        }
        if (user) {
            return res.json({'success': false, 'message': 'You\'ve already logged in!'});
        } else {
            return next();
        }
    })(req, res, next);
};

module.exports = middleware;
