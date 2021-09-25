
const dbConf = {
    mongoServerUrl : 'mongodb',
    mongoPort : 27017,
    databaseName : 'iot',
    databaseUser : 'iotuser',
    databasePassword : 'iot123'
};

module.exports = {

    url: 'mongodb://'+ dbConf.databaseUser+':'+dbConf.databasePassword+'@'+dbConf.mongoServerUrl+':'+dbConf.mongoPort+'/'+dbConf.databaseName, 
    dataNsamples:144
}