const Accion = require('../models/accion.model.js');


//--Devuelve todas las acciones de un dispositivo
exports.findAllDispo = (req, res) => {
    Accion.find({nombre:req.params.dispoId})
    .then(datos => {
        res.send(datos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error en la recuperacion de los registros."
        });
    });
};

//--Devuelve las acciones de un dispositivo de un dia
exports.findDispoDia = (req, res) => {
    Accion.find({nombre:req.params.dispoId,dia:{$eq:req.params.dia}})
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "Error en la recuperacion de los registros."
        });
    });

};

//--Devuelve las acciones de un dispositivo desde fecha hasta fecha
exports.findDispoDesdeHasta = (req, res) => {
    Accion.find({nombre:req.params.dispoId,dia:{$gte:req.params.fDesde},dia:{$lte:req.params.fHasta}})
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "Error en la recuperacion de los registros."
        });
    });

};

//--Guarda una accion
exports.pushAccion = (req, res) => {
    console.log("Accion recibida:",req.body);
    const accion = new Accion({
        "dispositivo":req.body.dispositivo, 
        "usuario": req.body.usuario, 
        "ts":new Date().getTime(),
        "comando":req.body.comando,
        "parametro":req.body.parametro
    });
    accion.save()
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message || "Error en la insercion de telemetria."
        });
    });
};
