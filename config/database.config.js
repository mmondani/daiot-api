
const dbConf = {
    mongoServerUrl : '192.168.1.220',
    mongoPort : 27017,
    databaseName : 'iot',
    databaseUser : 'iotuser',
    databasePassword : 'iot123'
};

module.exports = {

    url: 'mongodb://'+ dbConf.databaseUser+':'+dbConf.databasePassword+'@'+dbConf.mongoServerUrl+':'+dbConf.mongoPort+'/'+dbConf.databaseName  //mongodb://iotuser:iot123@192.168.1.220:27017/iot'
}