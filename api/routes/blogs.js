const express = require('express');
const showdown = require('showdown');
const Blog = require('../models/blog');
const middleware = require('../middleware');

let router = express.Router();
let converter = new showdown.Converter();

router.get('/', function(req, res) {
    let method = req.query.method || 'updatedDate';
    let sort = parseInt(req.query.sort || '-1');
    let page = parseInt(req.query.page || 1);
    let limit = 5;
    let offset = (page - 1) * limit;

    Blog.find({}).skip(offset).limit(limit).sort({[method]: sort}).exec(function(err, blogs) {
        if (err) {
            console.log(err);
            return res.json({'success': false, 'message': 'Database error'});
        } else {
            return res.json({'success': true, 'data': {'blogs': blogs}});
        }
    });
});

// new blog
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.json({'success': true});
});

// create blog
router.post('/', middleware.isLoggedIn, function(req, res) {
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    req.body.blog.author = {
        id: req.user._id,
        username: req.user.username,
    };
    Blog.create(req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
            return res.json({'success': false, 'message': 'Database error'});
        } else {
            // console.log('Created: ' + blog);
            return res.status(201).json({
                'success': true,
                'message': 'Posted successfully!',
            });
        }
    });
});

// show
router.get('/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
            return res.json({'success': false, 'message': 'Database error'});
        } else {
            // var m = moment(blog.updatedDate);
            blog.body = converter.makeHtml(blog.body);
            return res.json({
                'success': true,
                'data': {'blog': blog},
            });
        }
    });
});

// edit
// router.get('/:id/edit', middleware.hasPermission, function(req, res) {
//     Blog.findById(req.params.id, function(err, blog) {
//         if (err) {
//             console.log(err);
//             res.redirect('/blogs');
//         } else {
//             res.render('edit', {blog: blog});
//         }
//     });
// });

// update
router.put('/:id', middleware.hasPermission, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
            return res.json({'success': false, 'message': 'Database error'});
        } else {
            return res.json({'success': true, 'message': 'Updated post successfully!'});
        }
    });
});

// delete
router.delete('/:id', middleware.hasPermission, function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            return res.json({'success': false, 'message': 'Database error'});
        } else {
            return res.json({'success': true, 'message': 'Deleted post successfully!'});
        }
    });
});

module.exports = router;
