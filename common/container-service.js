const {spawnSync} = require('child_process');

async function runArchetypeContainer(imageName, version) {
    const command = 'docker'
    const image = `${imageName}:${version}`
    const volumeMounts = `-v ./src:/source:Z -v ./target:/target:Z`;
    const removeFlag = '--rm'
    const relativePathEnvironment = '-e RELATIVE_PATH=.'

    spawnSync(`${command} ${removeFlag} ${relativePathEnvironment} ${volumeMounts} ${image}`)
}

module.exports = {
    runArchetypeContainer
};