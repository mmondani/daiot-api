module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const auth = require('../middlewares/auth.middleware.js');

    // Create a new Note
    app.post('/users', auth,  user.createUser);

    // Retrieve all Notes
    app.get('/users/me', auth, user.verUser);

    // Retrieve a single Note with noteId
    app.post('/users/login', user.userLogin);

    // Update a Note with noteId
    //app.put('/empresas/:empresaId', empresas.update);

    // Delete a Note with noteId
    //app.delete('/empresas/:empresaId', empresas.delete);
}