const ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
    secretOrKey: '',
    issuer: 'blog.yynext.com',
    jsonWebTokenOptions: {
        maxAge: '1d',
    },
};

module.exports = opts;
