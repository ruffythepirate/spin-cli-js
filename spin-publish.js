const fs = require('fs');
const processService = require('./common/process-service');
const awsService = require('./common/awsService');
const toml = require('toml');

function verifyCanRun() {

    // verify aws credentials set.
    awsService.hasCredentials() || logAndThrowExitError('No AWS Credentials found!', 2);

    const config = loadConfig();

    // check bucket exists.
    awsService.verifyBucket(config.domainName);

    // check distribution exists.
    awsService.hasDistribution(config.domainName)

  fs.existsSync('./target') || logAndThrowExitError('Target folder not found!', 1);
}

async function syncDirectory() {
    const config = loadConfig();
    await awsService.syncDirToS3Bucket('./target', config.domainName);
    await awsService.invalidateCloudfrontWithAlias(config.domainName);
}


function loadConfig() {
    fs.existsSync('./.spin/config') || logAndThrowExitError('Could not find .spin directory. Can only publish from directory where spin init was run!', 1);
    try {
        const content = fs.readFileSync('./.spin/config.toml', {encoding: 'utf-8'})
        console.log(content)
        return toml.parse(content);
    } catch(e) {
        logAndThrowExitError(`Could not parse .spin/config.toml!, ${e}`, 1)
    }
}

function logAndThrowExitError(message, code) {
    throw new processService.ExitProcessError(message, code);
}

module.exports = {
  verifyCanRun,
  syncDirectory
};
