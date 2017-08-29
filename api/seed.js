const Blog = require('./models/blog');

let blogs = [];
let body = 'This is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\n';
for (let i = 0; i < 100; i++) {
    blogs.push({
        title: 'blog post' + String(i),
        body: body,
        summary: body.substring(0, 100),
    });
}

function seed() {
    Blog.find({author: null}).remove().exec(function(err) {
        blogs.forEach(function(b) {
            Blog.create(b, function(err, blog) {
                console.log('created blog');
            });
        });
    });
    Blog.find({author: {$ne: null}}, function(err, blogs) {
        blogs.forEach(function(blog) {
            blog.summary = blog.body.substring(0, 100);
            blog.save();
        });
    });
}

module.exports = seed;
