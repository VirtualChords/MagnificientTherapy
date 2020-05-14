const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = 
{
    dbUri : 'mongodb://localhost:27017/magnitherapy',
    dbName: 'magnitherapy',
    secret: 'ma1gana3fa3ca32nata'
}