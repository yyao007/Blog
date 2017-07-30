var express = require("express"),
	mongoose = require("mongoose"),
	showdown = require("showdown"),
	bodyParser = require("body-parser"),
	passport = require("passport"),
	session = require("express-session"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	https = require("https"),
	fs = require("fs"),
	LocalStrategy = require("passport-local"),
	app = express();

var User = require("./models/user"),
	Blog = require("./models/blog");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

showdown.setFlavor('github');
var converter = new showdown.Converter();

mongoose.connect("mongodb://localhost/blog", {useMongoClient: true});

// PASSPORT CONFIGURATION
app.use(session({
	secret: "I am YY for sure",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currUser = req.user;
	next();
});


app.get("/", function(req, res) {
	res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
	Blog.find({}, null, {sort: {updatedDate: -1}}, function (err, blogs) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("index", {blogs: blogs});
		}
	});
});

// new blog
app.get("/blogs/new", isLoggedIn, function (req, res) {
	res.render("new");
});

// create blog
app.post("/blogs", isLoggedIn, function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	req.body.blog.author = {
		id: req.user._id,
		username: req.user.username
	};
	Blog.create(req.body.blog, function (err, blog) {
		if (err) {
			console.log(err);
			res.redirect("/new");
		} else {
			console.log("Created: " + blog);
			res.redirect("/blogs");
		}
	});
});

// show
app.get("/blogs/:id", function (req, res) {
	Blog.findById(req.params.id, function (err, blog) {
		if (err) {
			console.log(err);
			res.redirect("/blogs");
		} else {
			blog.body = converter.makeHtml(blog.body);
			res.render("show", {blog: blog});
		}
	});
});

// edit
app.get("/blogs/:id/edit", hasPermission, function (req, res) {
	Blog.findById(req.params.id, function (err, blog) {
		if (err) {
			console.log(err);
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: blog});
		}
	});
});

// update
app.put("/blogs/:id", hasPermission, function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, blog) {
		if (err) {
			console.log(err);
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// delete
app.delete("/blogs/:id", hasPermission, function (req, res) {
	Blog.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			console.log(err);
		}
		res.redirect("/blogs");
	});
});

// Register route
app.get("/register", function (req, res) {
	res.render("register");
});

// Create new user
app.post("/register", function (req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/blogs");
		});
	});
});

// Log in form route
app.get("/login", function (req, res) {
	// console.log("Log in route");
	res.render("login");
});

// Log in user
app.post("/login", passport.authenticate("local", {
	successRedirect: "/blogs",
	failureRedirect: "/login"
}), function (req, res) {});

//Logout route
app.get("/logout", function (req, res) {
	req.logOut();
	res.redirect("/blogs");
});

app.listen(1993, function () {
	console.log("Blog Server listening on port 1993");
});


// handle https requests
// var sslOptions = {
//     key: fs.readFileSync("verification/key.pem"),
//     cert: fs.readFileSync("verification/cert.pem"),
//     passphrase: "931005"
// };
//
// https.createServer(sslOptions, app).listen(1994, function() {
//     console.log("Blog server with https listening on port 1994");
// });


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function hasPermission(req, res, next) {
	if (req.isAuthenticated()) {
		Blog.findById(req.params.id, function(err, blog) {
			if (err) {
				res.redirect("back");
			} else {
				if (blog.author.id.equals(req.user._id)) {
					return next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}
