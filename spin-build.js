const fsHelper = require('./common/fs-helper');
const containerService = require('./common/container-service');

function run() {

}

function verifyCanRun() {
    fsHelper.ensureDirPath('./.spin', 'Could not find .spin folder. Have you forgotten to call spin init?');
    fsHelper.ensureDirPathForce('./target');
    fsHelper.ensureDirPath('./src', 'Could not find src folder. Have you forgotten to call spin init?');
}

async function runBuild() {
    await containerService.runArchetypeContainer('spin-archetype-blog', 'latest');
}

module.exports = {
    run,
    runBuild,
    verifyCanRun
};