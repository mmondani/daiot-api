module.exports = (app) => {
    const datos = require('../controllers/dato.controller.js');
    const auth = require('../middlewares/auth.middleware.js');


    // Create a new Note
    app.post('/datos', auth, datos.create);

    // Retrieve all Notes
    app.get('/datos', auth, datos.findAll);

    // Retrieve a single Note with noteId
    app.get('/datos/:datoId', datos.findOne);

    // Update a Note with noteId
    app.put('/datos/:datoId', datos.update);

    // Delete a Note with noteId
    app.delete('/datos/:datoId', datos.delete);
}