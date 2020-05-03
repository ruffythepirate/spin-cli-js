const {spawn, spawnSync} = require('child_process');

const readline = require('readline');

function runAttachedContainer(imageName, version, dockerArgs, commandArgs) {

    const docker = 'docker';
    const args = ['run',
        ...dockerArgs,
        '--rm', '-it',
        `${imageName}:${version}`,
        ...commandArgs
    ];
    const dockerProcess = spawn(docker, args, {
        shell: true,
        stdio: ['inherit', 'inherit','inherit']
    });

    connectOutputs(dockerProcess, console.log, console.error)
}

async function runArchetypeContainer(imageName, version, stdout, stderr) {
    return new Promise(((resolve, reject) => {
        const command = 'docker'
        const dockerCommand = 'run'
        const image = `${imageName}:${version}`
        const sourceVolumeMount = `-v ./src:/source:Z`;
        const targetVolumeMount = `-v ./target:/target:Z`;
        const removeFlag = '--rm'
        const relativePathEnvironment = '-e RELATIVE_PATH=.'

        const compileProcess = spawn(
            command,
            [dockerCommand,
                sourceVolumeMount,
                targetVolumeMount,
                removeFlag,
                relativePathEnvironment,
                image],
            {
                shell: true
            }
            );

        compileProcess.on('close', (code) => {
            if(code === 0) {
                resolve();
            } else {
                reject(`Process finished with exit code ${code}`)
            }
        });

        connectOutputs(compileProcess, stdout, stderr);
    }));
}

function connectOutputs(childProcess, stdout, stderr) {
   childProcess.stdout && createInterface(childProcess.stdout, stdout);
   childProcess.stderr && createInterface(childProcess.stderr, stderr);
}

function createInterface(input, output) {
    const rlInterface = readline.createInterface ( {
        input: input
    });
    rlInterface.on ( 'line', output);
}

module.exports = {
    runArchetypeContainer,
    runAttachedContainer
};