module.exports = (app) => {
    const dispo = require('../controllers/dispo.controller.js');
    //const auth = require('../middlewares/auth.middleware.js');
    const passport = require('passport');
    const { register } = require('../controllers/dispo.controller.js');

    //--Registro
    app.post('/dispo/register', dispo.register); //si necesita auth passport.authenticate('jwt', { session: false })

}