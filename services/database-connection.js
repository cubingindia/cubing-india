const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');

let databaseCredentials;
// Look for database credentials in file
const databaseCredentialsFilePath = path.join('credentials', 'database-connection-credentials.json');
if (fs.existsSync(databaseCredentialsFilePath)) {
    databaseCredentials = JSON.parse(fs.readFileSync(databaseCredentialsFilePath, 'utf8'));
}

if (process.env.DATABASE && process.env.DATABASE_USERNAME && process.env.DATABASE_PASSWORD && process.env.DATABASE_HOST) {
    databaseCredentials = {
        "database": process.env.DATABASE,
        "host": process.env.DATABASE_HOST,
        "username": process.env.DATABASE_USERNAME,
        "password": process.env.DATABASE_PASSWORD,
        "port": process.env.DATABASE_PORT
    }
}

if (!databaseCredentials) {
    const errorMessage = 'Could not find ' + databaseCredentialsFilePath + ' or database credential environment variables';
    console.log(errorMessage);
    // throw new Error(errorMessage);
}

const connection = new sequelize(databaseCredentials.database, databaseCredentials.username, databaseCredentials.password, {
    host: databaseCredentials.host,
    dialect: 'mysql', // Assuming mysql for now since no one told me what type of database we're using
    operatorsAliases: false,
    port: databaseCredentials.port,
    define: {
        charset: 'utf8',
        dialectOptions: {
            collate: 'utf8mb4_unicode_ci'
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

connection
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = connection;
