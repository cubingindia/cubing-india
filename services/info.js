// Anything we want to expose to end users
const db = require('./database-interface');

const exported = {};

exported.getCompList = function(callback) {
    db.getCompList({}, function (databaseResponse) {
        callback(databaseResponse);
    })
};

exported.getComp = function(compId, callback) {
    db.getCompList({comp_id: compId}, function (databaseResponse) {
        callback(databaseResponse);
    })
};

module.exports = exported;
