const express = require('express');
const showdown = require('showdown');
const Blog = require('../models/blog');
const middleware = require('../middleware');

let router = express.Router();
let converter = new showdown.Converter();

router.get('/', function(req, res) {
    Blog.find({}, null, {sort: {updatedDate: -1}}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

// new blog
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('new');
});

// create blog
router.post('/', middleware.isLoggedIn, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    req.body.blog.author = {
        id: req.user._id,
        username: req.user.username,
    };
    Blog.create(req.body.blog, function(err, blog) {
        if (err) {
            req.flash('error', 'Database error');
            console.log(err);
            res.redirect('/new');
        } else {
            req.flash('success', 'Created post successfully!');
            // console.log('Created: ' + blog);
            res.redirect('/blogs');
        }
    });
});

// show
router.get('/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
            res.redirect('/blogs');
        } else {
            // var m = moment(blog.updatedDate);
            blog.body = converter.makeHtml(blog.body);
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

// update
router.put('/:id', middleware.hasPermission, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            req.flash('error', 'Database error');
            console.log(err);
            res.redirect('back');
        } else {
            req.flash('success', 'Updated post successfully!');
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// delete
router.delete('/:id', middleware.hasPermission, function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash('error', 'Database error');
            console.log(err);
            res.redirect('back');
        } else {
            req.flash('success', 'Deleted post successfully!');
            res.redirect('/blogs');
        }
    });
});

module.exports = router;
