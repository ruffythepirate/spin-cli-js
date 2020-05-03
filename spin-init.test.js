
const sut = require('./spin-init');

const giter8Service = require("./common/giter8-service");
const fs = require('fs');
const processService = require('./common/process-service');
const {when} = require('jest-when');


jest.mock('./common/process-service')
jest.mock('./common/giter8-service')
jest.mock('fs')


test('verifyCanRun when .spin dir exists should exit with code 0', () => {

    when(fs.existsSync).calledWith('./.spin').mockReturnValue(true)

    const result = sut.verifyCanRun();

    expect(processService.exit).toHaveBeenCalledWith(0);
});

test('verifyCanRun when . dir not empty should exit with code 1', () => {
    fs.readdirSync.mockReturnValue(['src'])

    const result = sut.verifyCanRun();

    expect(processService.exit).toHaveBeenCalledWith(1);
});

test('invokeTemplate when called should invoke the spin init template', () => {
    const spinInitTemplateId = 'ruffythepirate/spin-init.g8'

    const result = sut.invokeTemplate();

    expect(giter8Service.invokeTemplateSync).toHaveBeenCalledWith(spinInitTemplateId);
});
