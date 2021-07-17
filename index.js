const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
// create express app
const app = express();
const appPort = 3000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false  
}).then(() => {
    console.log("Conectado a la base de datos",dbConfig.url);    
}).catch(err => {
    console.log('No se pudo conectar a la base de datos', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "API para mongodb DAIoT."});
});

// Require Notes routes
require('./routes/empresa.routes.js')(app);
require('./routes/dato.routes.js')(app);
require('./routes/user.routes.js')(app);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport.config')(passport);

//const userRouter = require('./routes/user.routes.js')
//app.use(userRouter); //require('./routes/user.routes.js');

// listen for requests
app.listen(appPort, () => {
    console.log("Server escuchando en puerto",appPort);
});
