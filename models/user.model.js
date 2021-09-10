const mongoose = require('mongoose');         //paquetes requeridos
const validator = require('validator');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const JWT_KEY = 'WinterIsComingGOT2019';
const userSchema = mongoose.Schema({            //creamos nuestro esquema de mongoose
    name: {                                     // Este objeto define las diferentes propiedades del userSchema. 
        type: String,                           // Mongoose convertirá nuestro userSchema en un documento en la base de datos
        required: true,                         // y esas propiedades se convertirán en campos en nuestra base de datos.
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {     // valida si e texto introducido es un email válido
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
/*
userSchema.pre('save', async function (next) {                      // nos permite hacer algo antes de guardar el objeto creado
    // Encriptar el password antes de guardarlo en el model user
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)         //usamos bcrypt para encriptar la contraseña
    }                                                               // asegurarnos de que solo usemos hash de la contraseña si se modifica
    next()                                                          //  y es por eso que primero tenemos que verificar si la contraseña se modificó.
})

userSchema.methods.generateAuthToken = async function() {
    // Generar un método de autenticación para el usuario
    const user = this
    const token = jwt.sign({_id: user._id}, 'WinterIsComingGOT2019')   //process.env.JWT_KEY //Este método utiliza el JWT para firmar el método para crear un token. El método firmado espera los datos que se utilizarán para firmar el token y una clave JWT que puede ser una cadena aleatoria. Para nuestro caso, definimos uno en el archivo .env y lo llamamos JWT_KEY.
    user.tokens = user.tokens.concat({token})                       //Una vez creado el token, lo agregamos a la lista de tokens del usuario
    await user.save()                                               //guardamos
    return token                                                    //devolvemos el token
}

userSchema.statics.findByCredentials = async (email, password) => { //espera dos parámetros, el correo electrónico del usuario y la contraseña
    //const User = mongoose.model('User', userSchema)
    // Buscar el susuario por email y password.
    try{
        const user = await User.findOne({ email} );                            ////buscamos un usuario con el correo electrónico proporcionado utilizando el método de búsqueda de mongoose
        if (!user) {                                                            //Si el usuario no está disponible, arrojamos un error para informarle 
            return null
            //throw new Error({ error: 'Credenciales de login inválidas' })       //que las credenciales que proporcionó no son válidas
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)   //comparamos la contraseña recibida con la contraseña almacenada y si coinciden, devolvemos ese usuario. Utilizaremos esta función para registrar a los usuarios en la aplicación.
        if (!isPasswordMatch) {                     
            return null
            //throw new Error({ error: 'Credenciales de login inválidas' })
        }
        return user
    }
    catch (error) {
        return (error)
    }
        
}*/

//const User = mongoose.model('User', userSchema)                             //creamos un modelo llamado Usuario y le pasamos nuestro esquema de usuario creado
module.exports = mongoose.model('User', userSchema, 'iotUser');
