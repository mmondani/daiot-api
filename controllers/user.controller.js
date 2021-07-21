//const auth = require('../middlewares/auth.middleware.js')              //importamos el middleware de autenticación
//const express = require('express')
const User = require('../models/user.model.js')

//const router = express.Router()
//const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');
const nodeMailer = require('../config/nodemailer.config');
const jwtDecode = require('jwt-decode');
const bycrpt = require('bcryptjs');

exports.register = (req, res) => {
    //--Verifica si el usuario que quiere registrar tiene rol administrador
    getUserByEmail(req.body.admin, (err, user) => {
        if(user.rol=='admin') {      
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                rol: req.body.rol
            });
            getUserByEmail(newUser.email, (err, user) => {
                if (!err) {
                    if (user == null) {
                        createUser(newUser, (err, user) => {
                            if (err) {
                                res.status(401).json({ success: false, msg: 'Error al registrar el usuario', err: err });
                            } else {
                                res.status(200).json({ success: true, msg: 'Usuario registrado' });
                            }
                        });
                    } else {
                        res.status(401).json({ success: false, msg: 'La dirección de correo electrónico ya está registrada.' });
                    }
                }
            });
        } else {
            res.status(401).json({ success: false, msg: 'El usuario no es administraor' });    
        }
    });
}

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    getUserByEmail(email, (err, user) => {
        if (!err && user) {
            comparePassword(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    const token = jwt.sign({ data: user }, jwtconfig.secret, { expiresIn: 604800 });//equivale a 7 días
                    res.status(200).json({ success: true, msg: 'Login Ok ', token: 'Bearer ' + token });
                } else {
                    return res.status(401).json({ success: false, msg: 'El correo electrónico o la contraseña son incorrectos' });
                }
            });
        } else {
            return res.status(401).json({ success: false, msg: 'El correo electrónico o la contraseña son incorrectos' });
        }
    });
}

exports.profile = (req, res) => {
    res.json({ name: req.user.name, email: req.user.email });
}

exports.changepassword = (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    getUserByEmail(req.user.email, (err, user) => {

        if (!user) {
            return res.json({ success: false, msg: 'Ocurrio un error' });
        }
        comparePassword(oldPassword, user.password, (err, isMatch) => {
            if (isMatch) {
                updatePassword(req.user.email, newPassword, (err, user) => {
                    if (!err && !user) {
                        return res.status(401).json({ success: false, msg: 'No se pudo cambiar la contraseña' });
                    } else {
                        return res.json({ success: true, msg: 'Contraseña actualizada' });
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Contraseñas incorrectas' });
            }
        });
    });
}

exports.forgotpassword = (req, res) => {
    const email = req.body.email;
    getUserByEmail(email, (err, user) => {
        if (user == null) {
            res.json({ success: false, msg: 'Email no resgistrado' });
        } else {
            const token = jwt.sign({ data: { email: email } }, jwtconfig.secret, { expiresIn: 700 });
            const msg = '<p>Has olvidado tu contraseña, para cambiarla, enviar un POST con el token: ' + token + ' a la API'
            nodeMailer.nodeMailer(email, 'Has olvidado tu contraseña', msg);
            return res.json({ success: true, msg: 'Se ha enviado la notificación de contraseña olvidada' });
        }
    });
}

exports.resetpassword = (req, res) => {
    const password = req.body.newPassword;
    const email = jwtDecode(req.body.token).data.email;
    getUserByEmail(email, (err, user) => {

        if (!user) {
            return res.json({ success: false, msg: 'Ha ocurrido un error' });
        }
        updatePassword(email, password, (err, user) => {
            return res.json({ success: true, msg: 'La contraseña ha cambiado' });
        });
    });
}

function getUserByEmail(email, callback) {
    const query = { email: email }
    User.findOne(query, callback);
}

function createUser(newUser, callback) {
    bycrpt.genSalt(10, (err, salt) => {
        bycrpt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                throw err;
            }
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

function comparePassword(candidatePassword, hash, callback) {
    bycrpt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err
        callback(null, isMatch);
    });
}

function compareRol(candidateRol, rol, callback) {
    ((candidateRol==rol), (err, isMatch) => {
        if (err) throw err
        callback(null, isMatch);
    });
}

function updatePassword(email, newPassword, callback) {
    const query = {
        email: email
    }
    bycrpt.genSalt(10, (err, salt) => {
        bycrpt.hash(newPassword, salt, (err, hash) => {
            if (err) {
                throw err;
            }
            newPassword = hash;
            const toChangeQuery = {
                password: newPassword
            }
            User.findOneAndUpdate(query, toChangeQuery, callback);
        });
    });

}

/*
//router.post('/users', async (req, res) => {
exports.createUser = async (req, res) =>{
    // Crear nuevo usuario
    try {
        const user = new User(req.body)  // crea un nuevo usuario junto con la información de usuario suministrada a la que accedemos desde req.body
        user.save()                               // guarda e usuario
        const token = await user.generateAuthToken()    //generamos un token de autenticación
        res.status(201).send({ user, token })           //lo devolvemos (el token) como respuesta junto con los datos del usuario
    } 
    catch (error) { 
        res.status(400).send(error)
    }
}

//router.post('/users/login', async(req, res) => {
exports.userLogin = async (req, res) =>{
    //Inicia sesión de un usuario registrado
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } 
    catch (error) {
        res.status(400).send(error)
    }

}

//router.get('/users/me', auth, async(req, res) => {      //router para obtener el perfil de usuario -> solicitud al endpoint /users/me
exports.verUser = (req, res) =>{
    // Ver el profile del usuario logeado
    try{               
        res.send(req.user)                                  //obtengo el perfil de usuario de la solicitud
    }
    catch (error) {
        res.status(400).send(error)
    }
}


//router.post('/users/me/logout', auth, async (req, res) => {
    exports.logoutUser = async (req, res) =>{
    // Logout del usuario de la aplicación
    try {
        req.user.tokens = req.user.tokens.filter((token) => {   // filtramos la matriz de tokens del usuario -> 
            return token.token != req.token                     // devolvemos true si alguno de los tokens no es igual al token que utilizó el usuario para iniciar sesión -> El arreglo filter method crea una nuevo arreglo con todos los elementos que pasan la prueba implementada. En nuestro caso anterior, el método de filtro devolverá un nuevo arreglo que contiene cualquier otro token aparte del que se usó para iniciar sesión
        })
        await req.user.save()
        res.status(200).send(error)
    } 
    catch (error) {console.log(error)
        res.status(500).send(error)
    }
}*/

/*router.post('/users/me/logoutall', auth, async(req, res) => {
    // Logout del usuario de todos los dispositivos
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})*/

//module.exports = router