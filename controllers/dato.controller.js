const Dato = require('../models/dato.model.js');


//--Devuelve todos los datos de un dispositivo
exports.findAllDispo = (req, res) => {
    Dato.find({nombre:req.params.dispoId})
    .then(datos => {
        res.send(datos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error en la recuperacion de los registros."
        });
    });
};

//--Devuelve los datos de un dispositivo de un dia
exports.findDispoDia = (req, res) => {
    Dato.find({nombre:req.params.dispoId,dia:{$eq:req.params.dia}})
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "Error en la recuperacion de los registros."
        });
    });

};

//--Devuelve los datos de un dispositivo desde fecha hasta fecha
exports.findDispoDesdeHasta = (req, res) => {
    Dato.find({nombre:req.params.dispoId,dia:{$gte:req.params.fDesde},dia:{$lte:req.params.fHasta}})
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "Error en la recuperacion de los registros."
        });
    });

};

//--Guarda una telemetria
exports.pushTelemetry = (req, res) => {
    console.log(req.body);
    Dato.updateOne(
        {
            "nombre":req.body.Device, 
            "nsamples": {$lt: 144}, 
            "dia":new Date().toJSON().slice(0,10)
        },
        {
            $push:{"telemetry": 
            {
                "temp":req.body.Valores.Temperatura,
                "hum":req.body.Valores.Humedad,
                "pres":req.body.Valores.Presion,
                "ts":req.body.Valores.ts
            }
        },
            $min: {"primero": req.body.Valores.ts},
            $max: {"ultimo": req.body.Valores.ts},
            $inc:{"nsamples": 1} 
        },
        { 
            upsert: true 
        }
    )
    .then(dato=>{
        res.send(dato);
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message || "Error en la insercion de telemetria."
        });
    });
};
