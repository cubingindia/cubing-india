const fs = require('fs');
const path = require('path');

const exported = {};

let databaseCredentials;
// Look for database credentials in file
const databaseCredentialsFilePath = path.join('credentials', 'database-connection-credentials.json');
if (fs.existsSync(databaseCredentialsFilePath)) {
    databaseCredentials = fs.readFileSync(databaseCredentialsFilePath, 'utf8');
}

if (process.env.DATABASE && process.env.DATABASE_USERNAME && process.env.DATABASE_PASSWORD) {
    databaseCredentials = {
        "database": process.env.DATABASE,
        "username": process.env.DATABASE_USERNAME,
        "password": process.env.DATABASE_PASSWORD
    }
}

if (!databaseCredentials) {
    const errorMessage = 'Could not find ' + databaseCredentialsFilePath + ' or database credential environment variables';
    console.log(errorMessage);
    // throw new Error(errorMessage);
}

// TODO: use databaseCredentials to connect to the database

exported.get = function(table, request, callback) {
    callback("Nothing in database yet bro")
};

module.exports = exported;
