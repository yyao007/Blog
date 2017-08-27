const express = require('express');
// const bodyParser = require('body-parser');
const path = require('path');
// https = require('https'),
// http = require('http'),
// fs = require('fs'),
// moment = require('moment'),

let app = express();

// Routes
const blogsRoutes = require('./routes/blogs');
const indexRoutes = require('./routes/index');

// var createAdmin = require('./admin');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.locals.currUser = req.user;
    next();
});

app.use('/', indexRoutes);
app.use('/blogs', blogsRoutes);


app.use(function(req, res, next) {
    res.status(404).render('404', {url: req.url});
});

// HTTP server
// http.createServer(app).listen(1993, function () {
//     console.log('Blog Server listening on port 1993');
// });

app.listen(8080, function() {
    console.log('Blog Server listening on port 8080');
});

// HTTPS server
// var sslOptions = {
//     key: fs.readFileSync('verification/key.pem'),
//     cert: fs.readFileSync('verification/cert.pem'),
//     passphrase: '931005'
// };
//
// https.createServer(sslOptions, app).listen(1994, function() {
//     console.log('Blog server with https listening on port 1994');
// });
