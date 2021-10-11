const mongoose = require('mongoose');

const DispoSchema = mongoose.Schema({
    nombre: String,
    tipo: String,
    empresa:String,
    online: Boolean,
    canal1: Boolean,
    canal2: Boolean,
    ultimaTele: {
        Temperatura: Number,        //agregado para mentener la última telemetría
        Humedad: Number,
        ts: Number
    },
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