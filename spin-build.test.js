const sut = require('./spin-build');

const fsHelper = require('./common/fs-helper');

const { when } = require('jest-when');

jest.mock('./common/fs-helper');

test('verifyCanRun when called should ensure .spin, target and src folders exist', () => {
    sut.verifyCanRun();

    expect(fsHelper.ensureDirPath).toHaveBeenCalledWith('./.spin', expect.any(String))
    expect(fsHelper.ensureDirPathForce).toHaveBeenCalledWith('./target')
    expect(fsHelper.ensureDirPath).toHaveBeenCalledWith('./src', expect.any(String))
});