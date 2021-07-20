const mongoose = require('mongoose');

const AccionSchema = mongoose.Schema({
    dispositivo: String,
    usuario:String,
    ts:Date,
    canal:Number,
    estado: Boolean
});

module.exports = mongoose.model('Accion', AccionSchema,'iotAccion');