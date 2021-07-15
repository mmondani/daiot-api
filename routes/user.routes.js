const auth = require('../middlewares/auth.middleware.js')              //importamos el middleware de autenticación
const express = require('express')
const User = require('../models/user.model.js')

const router = express.Router()

router.post('/users', async (req, res) => {
    // Crear nuevo usuario
    try {
        const user = new User(req.body)  // crea un nuevo usuario junto con la información de usuario suministrada a la que accedemos desde req.body
        await user.save()                               // guarda e usuario
        const token = await user.generateAuthToken()    //generamos un token de autenticación
        res.status(201).send({ user, token })           //lo devolvemos (el token) como respuesta junto con los datos del usuario
    } 
    catch (error) { 
        res.status(400).send(error)
    }
})

router.post('/users/login', async(req, res) => {
    //Inicia sesión de un usuario registrado
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } 
    catch (error) {
        res.status(400).send(error)
    }

})

router.get('/users/me', auth, async(req, res) => {      //router para obtener el perfil de usuario -> solicitud al endpoint /users/me
    // Ver el profile del usuario logeado
    try{               
        res.send(req.user)                                  //obtengo el perfil de usuario de la solicitud
    }
    catch (error) {
        res.status(400).send(error)
    }
})


router.post('/users/me/logout', auth, async (req, res) => {
    // Logout del usuario de la aplicación
    try {
        req.user.tokens = req.user.tokens.filter((token) => {   // filtramos la matriz de tokens del usuario -> 
            return token.token != req.token                     // devolvemos true si alguno de los tokens no es igual al token que utilizó el usuario para iniciar sesión -> El arreglo filter method crea una nuevo arreglo con todos los elementos que pasan la prueba implementada. En nuestro caso anterior, el método de filtro devolverá un nuevo arreglo que contiene cualquier otro token aparte del que se usó para iniciar sesión
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/me/logoutall', auth, async(req, res) => {
    // Logout del usuario de todos los dispositivos
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router