const mongoose = require('mongoose');

const AccionSchema = mongoose.Schema({
    dispositivo: String,
    usuario:String,
    ts:Date,
    comando:String,
    parametro: String
});

/*const AccionSchema = mongoose.Schema({
    dispositivo: String,
    usuario:String,
    ts:Date,
    canal:String,
    estado: Boolean
});*/

module.exports = mongoose.model('Accion', AccionSchema,'iotAccion');