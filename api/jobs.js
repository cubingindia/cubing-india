// Functions for regularly performing jobs
// Using tsv version of the database since we're messing with the data before inserting it into our DB
const WCA_DB_URL = "https://www.worldcubeassociation.org/results/misc/WCA_export.tsv.zip";
const ZIPPED_TSV_FILE_NAME = 'WCA_export.tsv.zip';
const RESULTS_FILE_NAME = 'WCA_export_Results.tsv';

const path = require('path');
const tmp = require('tmp');
const fs = require('fs');
const download = require('download-file');
const unzip = require('unzip');
const fstream = require('fstream');
const csv = require('comma-separated-values');

const databaseConnection = require('database-connection');

const exported = {};

transferData = function (inputTSVSpath, transferDataCallback) {
    // For now, we're going to do this synchronously and on thread because it's simpler, the data isn't too big
    // and it makes running the callback after everything easier
    fs.readFile(path.join(inputTSVSpath, RESULTS_FILE_NAME), (err, data) => {
        if (err) throw err;
        data = data.toString();
        const parsedData = new csv(
            data, {
                header: true,
                cellDelimiter: '\t'
            }).parse();
        console.log(parsedData);

        // TODO: Insert this data into the db (once we have a development DB set up)

        transferDataCallback();
    });
};

exported.processWCADatabase = function (processWCADatabaseCallback) {
    tmp.dir(function _tempDirCreated(err, tempDirPath, cleanupDirectoryCallback) {
        if (err) throw err;

        const options = {
            directory: tempDirPath,
            filename: ZIPPED_TSV_FILE_NAME
        };

        const zippedDBPath = path.join(tempDirPath, ZIPPED_TSV_FILE_NAME);


        download(WCA_DB_URL, options, function (err) {
            if (err) {
                cleanupDirectoryCallback();
                throw err;
            }

            const readStream = fs.createReadStream(zippedDBPath);
            const writeStream = fstream.Writer(tempDirPath);

            console.log('Ready to pipe: ' + zippedDBPath + ' to ' + tempDirPath);

            readStream
                .pipe(unzip.Parse())
                .pipe(writeStream);

            readStream.on('close', function () {
                console.log('Finished unzipping DB');

                transferData(tempDirPath, function () {
                    const tempFiles = fs.readdirSync(tempDirPath);
                    for (let i = 0; i < tempFiles.length; i++) {
                        const filePath = path.join(tempDirPath, tempFiles[i]);
                        if (fs.exists(filePath)) {
                            console.log('removing' + filePath);
                            fs.unlinkSync(filePath);
                        }
                    }

                    // TODO: Fix cleanup and safely run cleanupDirectoryCallback
                    processWCADatabaseCallback('Finished processing WCA database');
                });
            });
        });
    });
};

module.exports = exported;
