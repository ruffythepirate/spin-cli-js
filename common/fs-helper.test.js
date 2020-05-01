const sut = require('./fs-helper');
const fs = require('fs');

jest.mock('fs')

const path = './my-path';

test('ensureDirPathForce when called should recursively create path if doesnt exist', () => {


    const result = sut.ensureDirPathForce(path);

    expect(fs.mkdirSync).toHaveBeenCalledWith(path, { recursive: true});
});

test('ensureDirPath when dir exists should check path exists', () => {
    fs.existsSync.mockReturnValue(true);
    const result = sut.ensureDirPath(path);
    expect(fs.existsSync).toHaveBeenCalledWith(path);
});

test('ensureDirPath when dir doesnt exist should throw error', () => {
    const errorMessage = 'err mess'
    fs.existsSync.mockReturnValue(false);

    expect(() => {
         sut.ensureDirPath(path, errorMessage);
    }).toThrow(new Error(errorMessage))

});
