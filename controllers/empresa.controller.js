const Empresa = require('../models/empresa.model.js');

// Create and Save a new
exports.create = (req, res) => {

};

// Retrieve and return all from the database.
exports.findAll = (req, res) => {
    Empresa.find()
    .then(empresas => {
        res.send(empresas);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single
exports.findOne = (req, res) => {

};

// Update 
exports.update = (req, res) => {

};

// Delete 
exports.delete = (req, res) => {

};