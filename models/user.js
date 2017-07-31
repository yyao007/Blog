var mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	group: {
		type: String,
		default: "User"
	}
}, {
	timestamps: {
		createdAt: "createdDate",
		updatedAt: "updatedDate"
	}
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);