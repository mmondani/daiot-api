const jwt = require('jsonwebtoken')
const User = require('../models/user.model.js')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')                //obtenemos el token del request header y dado que el token viene en un formato de Bearer[space]token, reemplazamos Bearer [space] con vacio ('')
        const data = jwt.verify(token,'WinterIsComingGOT2019' )         //process.env.JWT_KEY                    //verificar si el token recibido es válido o fue creado usando nuestra JWT_KEY
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })   //ahora podemos encontrar un usuario con esa identificación y también si el token está en la matriz de tokens del usuario.
        if (!user) {
            throw new Error()
        }
        req.user = user                                                             //adjuntamos el usuario a nuestra solicitud
        req.token = token                                                           //hacemos lo mismo para el token
        next()                                                                      //next() para ir al siguiente middleware. Si no se llama a next(), la aplicación se congelaría en ese punto y no procedería a ejecutar el resto del código
    } 
    catch (error) {
        res.status(401).send({ error: 'No está autorizado para acceder a este recurso' })
    }

}
module.exports = auth