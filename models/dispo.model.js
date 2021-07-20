const mongoose = require('mongoose');

const DispoSchema = mongoose.Schema({
    nombre: String,
    tipo: String,
    empresa:String,
    //token:String,
    variables:{
        temperatura:{
            unidad:String,
            prioridad:Number
        },
        humedad:{
            unidad:String,
            prioridad:Number
        },
        presion:{
            unidad:String,
            prioridad:Number
        }
    }
});

module.exports = mongoose.model('Dispo', DispoSchema,'iotDisp');