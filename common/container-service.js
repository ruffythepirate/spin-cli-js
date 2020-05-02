const {spawn} = require('child_process');

async function runArchetypeContainer(imageName, version, stdout, stderr) {
    return new Promise(((resolve, reject) => {
        const command = 'docker'
        const image = `${imageName}:${version}`
        const volumeMounts = `-v ./src:/source:Z -v ./target:/target:Z`;
        const removeFlag = '--rm'
        const relativePathEnvironment = '-e RELATIVE_PATH=.'

        const compileProcess = spawn(`${command} ${removeFlag} ${relativePathEnvironment} ${volumeMounts} ${image}`)
        compileProcess.on('close', (code) => {
            if(code === 0) {
                resolve();
            } else {
                reject(`Process finished with exit code ${code}`)
            }
        });

        compileProcess.stdout.on('data', stdout);
        compileProcess.stderr.on('data', stderr);
    }));



}

module.exports = {
    runArchetypeContainer
};