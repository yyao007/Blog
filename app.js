var express = require("express"),
	mongoose = require("mongoose"),
	showdown = require("showdown"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	https = require("https"),
	fs = require("fs"),
	app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

showdown.setFlavor('github');
var converter = new showdown.Converter();

mongoose.connect("mongodb://localhost/blog", {useMongoClient: true});

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
}, {
	timestamps: {
		createdAt: "createdDate",
		updatedAt: "updatedDate"
	}
});
var Blog = mongoose.model("blog", blogSchema);

// Blog.create({
// 	title: "Test blog",
// 	image: "https://source.unsplash.com/MN31CWOoEmc/600*400",
// 	body: "This is a test blog!!!!!"
// });

app.get("/", function(req, res) {
	res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
	Blog.find({}, function (err, blogs) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("index", {blogs: blogs});
		}
	});
});

// new blog
app.get("/blogs/new", function (req, res) {
	res.render("new");
});

// create blog
app.post("/blogs", function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
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
app.get("/blogs/:id/edit", function (req, res) {
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
app.put("/blogs/:id", function (req, res) {
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
app.delete("/blogs/:id", function (req, res) {
	Blog.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			console.log(err);
		}
		res.redirect("/blogs");
	});
});

app.listen(1993, function () {
	console.log("Blog Server listening on port 1993");
});


// handle https requests
var sslOptions = {
    key: fs.readFileSync("verification/key.pem"),
    cert: fs.readFileSync("verification/cert.pem"),
    passphrase: "931005"
};

https.createServer(sslOptions, app).listen(1994, function() {
    console.log("Blog server with https listening on port 1994");
});






