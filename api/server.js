const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const path = require('path');
const jwt = require('jsonwebtoken');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
// https = require('https'),
// http = require('http'),
// fs = require('fs'),
// moment = require('moment'),

let app = express();

// Models
const User = require('./models/user');
// const Blog = require('./models/blog');

// Routes
const blogsRoutes = require('./routes/blogs');
const indexRoutes = require('./routes/index');

// var createAdmin = require('./admin');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(expressSanitizer());

mongoose.connect(process.env.DATABASE_BLOG, {useMongoClient: true});

// PASSPORT CONFIGURATION
app.use(session({
    secret: 'I am YY for sure',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1993');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests
    // sent to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
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

app.listen(8081, function() {
    console.log('Blog Server listening on port 8081');
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
