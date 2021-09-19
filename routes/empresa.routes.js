module.exports = (app) => {
    const empresas = require('../controllers/empresa.controller.js');

    //--Create new 
    app.post('/empresa', empresas.create);

    //--Retrieve all 
    app.get('/empresas', empresas.findAll);

    //--Retrieve a single id
    app.get('/empresas/:empresaId', empresas.findOne);

    //--Update with noteId
    app.put('/empresas/:empresaId', empresas.update);

    //--Delete with noteId
    app.delete('/empresas/:empresaId', empresas.delete);
}