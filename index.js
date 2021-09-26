const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

//--Create express app
const app = express();
const appPort = 3000;

//--Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//--Parse requests of content-type - application/json
app.use(bodyParser.json())

let corsOptions = {
	origin: "*",
	optionsSucessStatus: 200
};
app.use(cors(corsOptions));

//--Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//--Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false  
}).then(() => {
    console.log("Connected to database:",dbConfig.url);    
}).catch(err => {
    console.log('Can\'t connect to database', err);
    process.exit();
});

//--Define a simple route
app.get('/', (req, res) => {
    res.json({"message": "API DAIoT."});
});

//--Define routes
require('./routes/empresa.routes.js')(app);
require('./routes/dato.routes.js')(app);
require('./routes/user.routes.js')(app);
require('./routes/accion.routes.js')(app);
require('./routes/dispo.routes.js')(app);
require('./config/passport.config')(passport);

//--Init passport auth 
app.use(passport.initialize());
app.use(passport.session());



//--listen for requests
app.listen(appPort, () => {
    console.log("API service running on port:",appPort);
});
