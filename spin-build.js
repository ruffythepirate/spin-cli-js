const fsHelper = require('./common/fs-helper');
const containerService = require('./common/container-service');

async function run() {
    verifyCanRun();

    try {
        await runBuild();
    } catch (e) {
        console.error(`Failed to run build because of ${e}`);
        process.exit(1);
    }

}

function verifyCanRun() {
    fsHelper.ensureDirPath('./.spin', 'Could not find .spin folder. Have you forgotten to call spin init?');
    fsHelper.ensureDirPathForce('./target');
    fsHelper.ensureDirPath('./src', 'Could not find src folder. Have you forgotten to call spin init?');
}

async function runBuild() {
    await containerService.runArchetypeContainer(
        'spin-archetype-blog',
        'latest',
        console.log,
        console.error);
}

module.exports = {
    run,
    runBuild,
    verifyCanRun
};