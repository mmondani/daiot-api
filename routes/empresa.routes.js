module.exports = (app) => {
    const empresas = require('../controllers/empresa.controller.js');

    // Create a new Note
    app.post('/empresa', empresas.create);

    // Retrieve all Notes
    app.get('/empresas', empresas.findAll);

    // Retrieve a single Note with noteId
    app.get('/empresas/:empresaId', empresas.findOne);

    // Update a Note with noteId
    app.put('/empresas/:empresaId', empresas.update);

    // Delete a Note with noteId
    app.delete('/empresas/:empresaId', empresas.delete);
}