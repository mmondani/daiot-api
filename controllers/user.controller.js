const User = require('../models/user.model.js')
const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');
const nodeMailer = require('../config/nodemailer.config');
const jwtDecode = require('jwt-decode');
const bycrpt = require('bcryptjs');

exports.register = (req, res) => {
    //--Verify if request user is administrator
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
//--login with user received on body
exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //--Search in DB user by email
    getUserByEmail(email, (err, user) => {
        if (!err && user) {
            //--Compare password received against password in db
            comparePassword(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    //--If passwords match, generate token with only _id, secret and duration of 86400 seg. (one day)
                    const token = jwt.sign({ data: {"_id":user._id} }, jwtconfig.secret, { expiresIn: 86400 });
                    //--Send response to UI with token
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