const mongoose = require('mongoose');

const DatoSchema = mongoose.Schema({
    primero: String,
    ultimo: String,
    telemetry:JSON,
    nombre:String,
    nsamples:Number,
    dia:String
},
{
    collection: 'iotDato'

});

module.exports = mongoose.model('Dato', DatoSchema);