const sut = require('./container-service');

const {spawn} = require('child_process');

jest.mock('child_process');

const imageName = 'blog';
const version = 'latest';

let spawnResponseMock;

beforeEach(() => {
    spawnResponseMock = {
        on: jest.fn(),
        stdout: {
            on: jest.fn()
        },
        stderr: {
            on: jest.fn()
        }
    }
  spawn.mockReturnValue(spawnResponseMock);
});
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

test('runArchetypeContainer when container logs to stdout should log to stdout', () => {
    const logStdout = jest.fn();
    const result = sut.runArchetypeContainer(imageName, version, logStdout);
    const stdoutMethod = spawnResponseMock.stdout.on.mock.calls[0][1];

    const testLog = 'test';
    stdoutMethod(testLog)

    expect(logStdout).toHaveBeenCalledWith(testLog);
});

test('runArchetypeContainer when container logs to stdout should log to stdout', () => {
    const logStderr = jest.fn();
    const result = sut.runArchetypeContainer(imageName, version, null, logStderr);
    const stderrMethod = spawnResponseMock.stderr.on.mock.calls[0][1];

    const testLog = 'test';
    stderrMethod(testLog)

    expect(logStderr).toHaveBeenCalledWith(testLog);
});

function runAndGetCommand() {
    const result = sut.runArchetypeContainer(imageName, version);
    const spawnCommand = spawn.mock.calls[0][0];
    return spawnCommand;
}

