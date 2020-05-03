const fs = require('fs');
const giter8Service = require("./common/giter8-service");

const processService = require('./common/process-service');

function verifyCanRun() {
    fs.existsSync('./.spin') && logAndExit('Found .spin folder, spin has already been initialized!', 0)
    fs.readdirSync('.') && logAndExit('Current folder is not empty, only allowed to run init in empty folders', 1)
}

function invokeTemplate() {
    giter8Service.invokeTemplateSync('ruffythepirate/spin-init.g8')
}

function logAndExit(message, code) {
    console.log(message)
    processService.exit(code)
}

module.exports = {
    verifyCanRun,
    invokeTemplate
};