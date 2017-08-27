const express = require('express');
const middleware = require('../middleware');

let router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

// new blog
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('new');
});

// show
router.get('/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
            res.redirect('/blogs');
        } else {
            // var m = moment(blog.updatedDate);
            res.render('show', {blog: blog});
        }
    });
});

// edit
router.get('/:id/edit', middleware.hasPermission, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: blog});
        }
    });
});

module.exports = router;
