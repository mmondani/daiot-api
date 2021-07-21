const Dispo = require('../models/dispo.model.js')
const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');
const nodeMailer = require('../config/nodemailer.config');
const jwtDecode = require('jwt-decode');
const bycrpt = require('bcryptjs');



exports.authTelemetry = (req,res, next) => {
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



