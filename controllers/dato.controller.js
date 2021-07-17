const Dato = require('../models/dato.model.js');

// Create and Save a new Note
exports.create = (req, res) => {

};

//--Devuelve todos los datos de un dispositivo
exports.findAllDispo = (req, res) => {
    Dato.find({nombre:req.params.dispoId})
    .then(empresas => {
        res.send(empresas);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
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
            message: err.message || "Error en la recuperacion de un registro"
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
            message: err.message || "Error en la recuperacion de un registro"
        });
    });

};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

};