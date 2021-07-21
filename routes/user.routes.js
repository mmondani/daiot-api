module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    //const auth = require('../middlewares/auth.middleware.js');
    const passport = require('passport');
    const { register, login, profile, changepassword, forgotpassword, resetpassword } = require('../controllers/user.controller.js');

    //--Registro
    app.post('/register', passport.authenticate('jwt', { session: false }), user.register);

    //--Login
    app.post('/login', user.login);

    //--Perfil de usuario
    app.get('/users/me/profile', passport.authenticate('jwt', { session: false }), user.profile); //antes auth

    //--Cambia password
    app.post('/changepassword', passport.authenticate('jwt', { session: false }), changepassword);

    //--Olvidó password
    app.post('/forgotpassword', forgotpassword);

    //--Resetea password
    app.post('/resetpassword', resetpassword)
}