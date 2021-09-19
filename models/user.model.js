const mongoose = require('mongoose');         
const validator = require('validator');

/*
* Creamos nuestro esquema de mongoose.
* Este objeto define las diferentes propiedades del userSchema. 
* Mongoose convertirá nuestro userSchema en un documento en la base de datos
* y esas propiedades se convertirán en campos en nuestra base de datos.
*/

const userSchema = mongoose.Schema({            
    name: {                                     
        type: String,                           
        required: true,                         
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            //-- Validate email
            if (!validator.isEmail(value)) {     
                throw new Error({error: 'Dirección de correo inválida'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    rol:{
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('User', userSchema, 'iotUser');
