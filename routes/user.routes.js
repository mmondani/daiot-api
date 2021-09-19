

module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const passport = require('passport');
    const { register, login, profile, changepassword, forgotpassword, resetpassword } = require('../controllers/user.controller.js');

    //--Register
    app.post('/register', passport.authenticate('jwt', { session: false }), user.register);

    //--Login
    app.post('/login', user.login);

    //--Profile
    app.get('/users/me/profile', passport.authenticate('jwt', { session: false }), user.profile); //antes auth

    //--Change password
    app.post('/changepassword', passport.authenticate('jwt', { session: false }), changepassword);

    //--Forgot password
    app.post('/forgotpassword', forgotpassword);

    //--Reset password
    app.post('/resetpassword', resetpassword)
}