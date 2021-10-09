const Dispo = require('../models/dispo.model.js')
const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');
const nodeMailer = require('../config/nodemailer.config');
const jwtDecode = require('jwt-decode');
const bycrpt = require('bcryptjs');



exports.authTelemetry = (req,res, next) => {
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
        online: false,
        canal1: false,
        canal2: false,
        ultimaTele: {
            Temperatura: 0,
            Humedad: 0,
            ts: 0
        },
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

exports.getDispos = (req, res) => {
    Dispo.find((err, dispos) => {
        if (!err) {
            res.status(200).json(dispos);
        }
        else {
            res.status(500).json({success: false, msg: 'Error al solicitar los dispositivos'})
        }
    })
}


exports.getDispo = (req, res) => {
    Dispo.findOne({nombre: req.params.dispoId},
        (err, dispos) => {
            if (!err) {
                res.status(200).json(dispos);
            }
            else {
                res.status(500).json({success: false, msg: 'Error al solicitar el dispositivo'})
            }
    })
}



exports.updateCanal = (req, res) => {
    console.log("Cambio en un canal recibido:",req.body);
    
    Dispo.updateOne(
        {"nombre":req.body.Device},
        {$set:{[`canal${req.body.Valores.Canal}`]: req.body.Valores.Estado === 1? true: false}}
    )
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message || "Error en la insercion del update de canal."
        });
    });
}


exports.updateStatus = (req, res) => {
    console.log("Cambio status de conexión recibido:",req.body);
    
    Dispo.updateOne(
        {"nombre":req.body.Device},
        {$set:{"online": req.body.Status === "online"? true: false}}
    )
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message || "Error en la insercion del update del status de conexión."
        });
    });
}

exports.updateUltimaTele = (req, res) => {
    console.log("Cambio última telemedición recibido:",req.body);
    
    Dispo.updateOne(
        {"nombre":req.body.Device},
        {$set:{"ultimaTele": req.body.Valores}}
    )
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message || "Error en la insercion del update de la última telemedición."
        });
    });
}



function getDispoByname(nombre, callback) {
    const query = { nombre: nombre }
    Dispo.findOne(query, callback);
}

function createDispo(newDispo, callback) {
    newDispo.save(callback);
}



