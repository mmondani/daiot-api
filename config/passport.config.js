const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');
const jwtconfig = require('./jwt.config.js');


module.exports = function (passport) {
    let opts = {};
    //--Method to extract token from UI
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    //--Secret
    opts.secretOrKey = jwtconfig.secret;

    //--Define strategy to authorization
    passport.use(new Strategy(opts, (payload, done) => {
        //--With verified token, search user (by _id)
        getUserById(payload.data._id, (err, user) => {
            //--Error in search
            if (err) {
                console.log('Error in search:',err);
                return done(err, false);
            }
            //--User exist
            if (user) {
                return done(null, user);
            //--User doesn't exist
            } else {
                console.log('User doesn\'t exist',err);
                return done(null, false);
            }
        });
    }));

}

function getUserById(id, callback) {
    User.findById(id, callback);
}