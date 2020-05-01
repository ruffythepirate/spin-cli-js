const sut = require('./container-service');

const {spawnSync} = require('child_process');

jest.mock('child_process');

const imageName = 'blog';
const version = 'latest';

test('runArchetypeContainer when called should mount src and target folders', () => {
    const spawnCommand = runAndGetCommand();

    expect(spawnCommand).toContain('-v ./src:/source:Z');
    expect(spawnCommand).toContain('-v ./target:/target:Z');
});

test('runArchetypeContainer when called should invoke docker command', () => {
    const spawnCommand = runAndGetCommand();

    expect(spawnCommand).toMatch(/^docker /);
});

test('runArchetypeContainer when called should invoke archetype image and version', () => {
    const spawnCommand = runAndGetCommand();

    expect(spawnCommand).toMatch(new RegExp(`${imageName}:${version}`));
});

test('runArchetypeContainer when called should specify --rm flag', () => {
    const spawnCommand = runAndGetCommand();

    expect(spawnCommand).toContain('--rm');
});

test('runArchetypeContainer when called should specify relative dir as .', () => {
    const spawnCommand = runAndGetCommand();

    expect(spawnCommand).toContain('-e RELATIVE_PATH=.');
});

function runAndGetCommand() {
    const result = sut.runArchetypeContainer(imageName, version);
    const spawnCommand = spawnSync.mock.calls[0][0];
    return spawnCommand;
}