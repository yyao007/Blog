const User = require('./models/user');

// create a admin user
function createAdmin(username, password) {
    const newUser = new User({username: username, group: 'admin'});
    User.register(newUser, password, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log('created user:', user);
        }
    });
}

module.exports = createAdmin;
