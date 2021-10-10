module.exports = (app) => {
    const dispo = require('../controllers/dispo.controller.js');
    const passport = require('passport');
    const { register } = require('../controllers/dispo.controller.js');

    //--Registro
    app.post('/dispo/register', passport.authenticate('jwt', { session: false }), dispo.register);

    // --Visualización
    app.get('/dispo', passport.authenticate('jwt', { session: false }), dispo.getDispos);

    // --Visualización
    app.get('/dispo/:dispoId', passport.authenticate('jwt', { session: false }), dispo.getDispo);

    // --Guarda el estado de los canales
    app.put('/dispo/canal', dispo.updateCanal)

    // --Guarda el estado de conexión del dispositivo
    app.put('/dispo/status', dispo.updateStatus)

    // --Guarda la última telemedición del dispositivo
    app.put('/dispo/ultima-tele', dispo.updateUltimaTele)
}