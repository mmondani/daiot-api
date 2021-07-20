const Dispo = require('../models/dispo.model.js')
const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');
const nodeMailer = require('../config/nodemailer.config');
const jwtDecode = require('jwt-decode');
const bycrpt = require('bcryptjs');

exports.auth = (req,res, next) => {
    //console.log("auth:",req.body.Device);
    getDispoByname(req.body.Device, (err, dispo) => {
        if (!err) {
            if (dispo == null) {
                res.status(401).json({ success: false, msg: 'El dispositivo no está registrado.' });
            } else {
                next();
            }
        }
    });
}

exports.register = (req, res) => {
    let newDispo = new Dispo({
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        empresa: req.body.empresa,
        variables:{
            temperatura:{
                unidad:req.body.variables.temperatura.unidad,
                prioridad:req.body.variables.temperatura.prioridad,
            },
            humedad:{
                unidad:req.body.variables.humedad.unidad,
                prioridad:req.body.variables.humedad.prioridad,
            },
            presion:{
                unidad:req.body.variables.presion.unidad,
                prioridad:req.body.variables.presion.prioridad
            }
        }
    });

    getDispoByname(newDispo.nombre, (err, dispo) => {
        if (!err) {
            if (dispo == null) {
                createDispo(newDispo, (err, dispo) => {
                    if (err) {
                        res.status(401).json({ success: false, msg: 'Error al registrar el dispositivo.', err: err });
                    } else {
                        res.status(200).json({ success: true, msg: 'Dispositivo registrado.' });
                    }
                });
            } else {
                res.status(401).json({ success: false, msg: 'El dispositivo ya está registrado.' });
            }
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

function getDispoByname(nombre, callback) {
    const query = { nombre: nombre }
    Dispo.findOne(query, callback);
}

function createDispo(newDispo, callback) {
    //newDispo.token = jwt.sign({ data: newDispo.nombre }, jwtconfig.secret);
    newDispo.save(callback);
    /*bycrpt.genSalt(10, (err, salt) => {
        bycrpt.hash(newDispo.password, salt, (err, hash) => {
            if (err) {
                throw err;
            }
            newUser.password = hash;
            newDispo.save(callback);
        });
    });*/
}

function comparePassword(candidatePassword, hash, callback) {
    bycrpt.compare(candidatePassword, hash, (err, isMatch) => {
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

