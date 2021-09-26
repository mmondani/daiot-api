module.exports = (app) => {
    const dispo = require('../controllers/dispo.controller.js');
    const passport = require('passport');
    const { register } = require('../controllers/dispo.controller.js');

    //--Registro
    app.get('/dispo/register', passport.authenticate('jwt', { session: false }), dispo.register);

    // --Visualización
    app.get('/dispo', passport.authenticate('jwt', { session: false }), dispo.get);
}