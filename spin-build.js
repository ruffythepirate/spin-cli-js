const fsHelper = require('./common/fs-helper');


function run() {

}

function verifyCanRun() {
    fsHelper.ensureDirPath('./.spin', 'Could not find .spin folder. Have you forgotten to call spin init?');
    fsHelper.ensureDirPathForce('./target');
    fsHelper.ensureDirPath('./src', 'Could not find src folder. Have you forgotten to call spin init?');
}

module.exports = {
    run,
    verifyCanRun
};