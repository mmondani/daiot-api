module.exports = (app) => {
    const datos = require('../controllers/dato.controller.js');
    //const auth = require('../middlewares/auth.middleware.js');
    const passport = require('passport');

    //--Devuelve todos los datos de un dispositivo
    app.get('/datos/:dispoId', passport.authenticate('jwt', { session: false }), datos.findAllDispo);

    //--Devuelve los datos de un dispositivo de un dia
    app.get('/datos/:dispoId/:dia', passport.authenticate('jwt', { session: false }), datos.findDispoDia);

    //--Devuelve los datos de un dispositivo desde fDesde hasta fHasta
    app.get('/datos/:dispoId/:fDesde/:fHasta', passport.authenticate('jwt', { session: false }), datos.findDispoDesdeHasta);

    //--Guarda una telemetria
    app.put('/telemetry', datos.pushTelemetry);

}