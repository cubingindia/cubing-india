// Anything we want to expose to end users
const databaseConnection = require('./database-connection');

const exported = {};

exported.getCompList = function(req, callback) {
    databaseConnection.get('competitions', req, function (databaseResponse) {
        callback(databaseResponse);
    })
};

module.exports = exported;
