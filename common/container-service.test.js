const sut = require('./container-service');

const {spawn, spawnSync} = require('child_process');

jest.mock('child_process');

const imageName = 'blog';
const version = 'latest';

let spawnResponseMock;

beforeEach(() => {
    jest.clearAllMocks();
    spawnResponseMock = {
        on: jest.fn(),
    }
  spawn.mockReturnValue(spawnResponseMock);
});

test('runArchetypeContainer when called should mount src and target folders', () => {
    const [spawnCommand, args] = runAndGetCommandAndArguments();

    expect(args).toContain('-v ./src:/source:Z');
    expect(args).toContain('-v ./target:/target:Z');
});

test('runArchetypeContainer when called should invoke docker command', () => {
    const [spawnCommand, args] = runAndGetCommandAndArguments();

    expect(spawnCommand).toMatch(/^docker/);
    expect(args[0]).toMatch(/^run/);
});

test('runArchetypeContainer when called should invoke archetype image and version', () => {
    const [spawnCommand, args] = runAndGetCommandAndArguments();

    expect(args).toContain(`${imageName}:${version}`);
});

test('runArchetypeContainer when called should specify --rm flag', () => {
    const [spawnCommand, args] = runAndGetCommandAndArguments();

    expect(args).toContain('--rm');
});

test('runArchetypeContainer when called should specify relative dir as .', () => {
    const [spawnCommand, args] = runAndGetCommandAndArguments();

    expect(args).toContain('-e RELATIVE_PATH=.');
});

test('runArchetypeContainer when process exits with status code = 0 should resolve promise', async () => {
    const result = sut.runArchetypeContainer();
    const closeMethod = spawnResponseMock.on.mock.calls[0][1];
    closeMethod(0);
    await expect(result).resolves.toBe(undefined)
});

test('runArchetypeContainer when process exits with status code != 0 should reject promise', async () => {
    const result = sut.runArchetypeContainer();
    const closeMethod = spawnResponseMock.on.mock.calls[0][1];
    closeMethod(1);
    await expect(result).rejects.toBeTruthy()
});

test('runAttachedContainer when called should invoke docker with correct arguments', () => {
    const commandArgs = ['commandLineArgs'];
    const dockerArgs = ['dockerArgs'];
    const imageName = 'someImage';
    const version = 'latest';
    const result = sut.runAttachedContainer(imageName, version, dockerArgs, commandArgs);

    const expectedArgs = ['run']
        .concat(dockerArgs)
        .concat(['--rm', '-it'])
        .concat([`${imageName}:${version}`])
        .concat(commandArgs)

    expect(spawn).toHaveBeenCalledWith('docker', expectedArgs, {shell: true, stdio: ['inherit', 'inherit', 'inherit']});
});

function runAndGetCommandAndArguments() {
    sut.runArchetypeContainer(imageName, version, console.log, console.error);
    const commandAndArguments = spawn.mock.calls[0];
    return commandAndArguments;
}
