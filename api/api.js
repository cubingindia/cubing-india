const express = require('express');
const packageFile = require('../package.json');
const info = require('./info');

console.log('Running api.js');

const router = express.Router();

router.get('/version', function (req, res) {
    res.send(packageFile.version);
});

router.get('/competitions', function (req, res) {
    info.getCompList(req, function (compList) {
        res.send(compList);
    });
});

console.log('Exporting router');
module.exports = router;
