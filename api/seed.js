const Blog = require('./models/blog');

blogs = [];
for (let i = 0; i < 100; i++) {
    blogs.push({
        title: 'blog post' + String(i),
        body: 'This is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\nThis is a test post\n',
    });
}

function seed() {
    blogs.forEach(function(b) {
        Blog.create(b, function(err, blog) {
            console.log('created blog');
        });
    });
}

module.exports = seed;
