const fs = require('fs');
const db = require('./database-connection');

const exported = {};

// Define models
const models = {};
const importedModels = fs.readdirSync('./services/models');
importedModels.forEach(function (fileName) {
    const modelName = fileName.split('.js')[0];
    models[modelName] = db.define(modelName, require('./models/' + modelName));
    models[modelName].sync({alter: true});
});

exported.createComps = function (comps, callback) {
    // Note: For now we're just going to store each field
    // I don't know why
    const insertableComps = comps.map(comp => {
        return {
            comp_id: comp.id, // we need to use comp_id instead of id because sequelize uses id
            name: comp.name,
            city_name: comp.cityName,
            information: comp.information,
            year: comp.year,
            month: comp.month,
            day: comp.day,
            end_month: comp.endMonth,
            end_day: comp.endDay,
            event_specs: comp.eventSpecs,
            wca_delegate: comp.wcaDelegate,
            organiser: comp.organiser,
            venue: comp.venue,
            venue_address: comp.venueAddress,
            venue_details: comp.venueDetails,
            external_website: comp.external_website || '',
            cell_name: comp.cellName,
            latitude: comp.latitude,
            longitude: comp.longitude
        }
    });
    models['Competition'].bulkCreate(insertableComps).then(() =>
        callback('Triggered bulk insertion of ' + insertableComps.length + ' competitions')
    );
};

exported.getCompList = function (where, callback) {
    models['Competition'].findAll({where: where}).then(comps => {
        callback(comps);
    }).catch((reason) => {
        callback(reason);
    });
};

module.exports = exported;
