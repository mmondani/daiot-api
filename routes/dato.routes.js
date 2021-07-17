module.exports = (app) => {
    const datos = require('../controllers/dato.controller.js');
    const auth = require('../middlewares/auth.middleware.js');
    const passport = require('passport');

    //--Devuelve todos los datos de un dispositivo
    app.get('/datos/:dispoId', passport.authenticate('jwt', { session: false }), datos.findAllDispo);

    // Retrieve all Notes
    //app.get('/datos', passport.authenticate('jwt', { session: false }), datos.findAll);

    //--Devuelve los datos de un dispositivo de un dia
    app.get('/datos/:dispoId/:dia', passport.authenticate('jwt', { session: false }), datos.findDispoDia);

    //--Devuelve los datos de un dispositivo desde fDesde hasta fHasta
    app.get('/datos/:dispoId/:fDesde/:fHasta', passport.authenticate('jwt', { session: false }), datos.findDispoDesdeHasta);

    // Update a Note with noteId
    app.put('/datos/:datoId', datos.update);

    // Delete a Note with noteId
    app.delete('/datos/:datoId', datos.delete);
}