module.exports = (app) => {
    const datos = require('../controllers/dato.controller.js');

    // Create a new Note
    app.post('/datos', datos.create);

    // Retrieve all Notes
    app.get('/datos', datos.findAll);

    // Retrieve a single Note with noteId
    app.get('/datos/:datoId', datos.findOne);

    // Update a Note with noteId
    app.put('/datos/:datoId', datos.update);

    // Delete a Note with noteId
    app.delete('/datos/:datoId', datos.delete);
}