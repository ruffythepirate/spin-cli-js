const sut = require('./spin-build');

const fsHelper = require('./common/fs-helper');
const containerService = require('./common/container-service');

const { when } = require('jest-when');

jest.mock('./common/fs-helper');
jest.mock('./common/container-service');

test('verifyCanRun when called should ensure .spin, target and src folders exist', () => {
    sut.verifyCanRun();

    expect(fsHelper.ensureDirPath).toHaveBeenCalledWith('./.spin', expect.any(String))
    expect(fsHelper.ensureDirPathForce).toHaveBeenCalledWith('./target')
    expect(fsHelper.ensureDirPath).toHaveBeenCalledWith('./src', expect.any(String))
});

test('runBuild when called should start blog archetype.', async () => {
    const result = await sut.runBuild();

    expect(containerService.runArchetypeContainer).toHaveBeenCalledWith('spin-archetype-blog', 'latest', console.log, console.error);
});