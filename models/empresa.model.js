const mongoose = require('mongoose');

const EmpresaSchema = mongoose.Schema({
    nombre: String,
    dirección: String,
    ciudad:String,
    pais:String
},
{
    collection: 'iotEmpresa'

});

module.exports = mongoose.model('Empresa', EmpresaSchema);