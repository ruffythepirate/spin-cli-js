const fs = require('fs');

function ensureDirPath(path, errorMessage) {

    const pathExists = fs.existsSync(path);
    if(!pathExists) {
        throw new Error(errorMessage);
    }


}

function ensureDirPathForce(path) {
    fs.mkdirSync(path, {recursive: true})
}

module.exports = {
    ensureDirPath,
    ensureDirPathForce
};