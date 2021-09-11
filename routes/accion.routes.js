module.exports = (app) => {
    const accion = require('../controllers/accion.controller.js');
    //const auth = require('../middlewares/auth.middleware.js');
    const passport = require('passport');

    //--Devuelve todos las acciones de un dispositivo
    app.get('/action/:dispoId', passport.authenticate('jwt', { session: false }), accion.findAllDispo);

    //--Devuelve las acciones de un dispositivo de un dia
    app.get('/action/:dispoId/:dia', passport.authenticate('jwt', { session: false }), accion.findDispoDia);

    //--Devuelve las acciones de un dispositivo desde fDesde hasta fHasta
    app.get('/action/:dispoId/:fDesde/:fHasta', passport.authenticate('jwt', { session: false }), accion.findDispoDesdeHasta);

    //--Guarda una acción
    app.put('/action', passport.authenticate('jwt', { session: false }), accion.pushAccion);

}