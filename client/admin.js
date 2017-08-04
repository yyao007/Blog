var User = require("./models/user");

function createAdmin(username, password) {
	var newUser = new User({username: username, group: "admin"});
	User.register(newUser, password, function(err, user) {
		if (err) {
			console.log(err);
		} else {
			console.log("created user:", user);
		}
	});
}

module.exports = createAdmin;