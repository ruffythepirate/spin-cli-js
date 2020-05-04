const sut = require('./spin-publish')
const processService = require('./common/process-service');
const fs = require('fs');
const awsService = require('./common/awsService');

jest.mock('fs');
jest.mock('./common/awsService')

const domainName = "example.com"
beforeEach(() => {
    jest.resetAllMocks();
    awsService.hasCredentials.mockReturnValue(true)
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(`domainName = "${domainName}"`);
});

test('verifyCanRun when all is fine should run fine', () => {
    const result = sut.verifyCanRun();
});

test('verifyCanRun when no .spin/config.toml should exit with code 1', () => {
    fs.existsSync.mockReturnValue(false);

    expect(sut.verifyCanRun).toThrow(processService.ExitProcessError)
});

test('verifyCanRun when invalid config should exit with code 1', () => {
    fs.readFileSync.mockReturnValue('invalidformat')
    expect(sut.verifyCanRun).toThrow(processService.ExitProcessError);
    expect(fs.readFileSync).toHaveBeenCalledWith('./.spin/config.toml', {encoding: 'utf-8'})
});

test('verifyCanRun when no AWS credentials should exit with code 2', () => {
    awsService.hasCredentials.mockReturnValue(false);

    expect(sut.verifyCanRun).toThrow(processService.ExitProcessError);
});

test('verifyCanRun should exit when no target folder exists', () => {
  fs.existsSync.mockReset();
  fs.existsSync.mockReturnValueOnce(true)
  fs.existsSync.mockReturnValueOnce(false)

    expect(sut.verifyCanRun).toThrow(processService.ExitProcessError);
});

test('verifyCanRun when called should verify bucket with domain name', () => {
    const domainName = 'test.de';
    fs.readFileSync.mockReturnValue(`domainName="${domainName}"`)
    const result = sut.verifyCanRun();

    expect(awsService.verifyBucket).toHaveBeenCalledWith(domainName);
});

test('syncDirectory when called should invoke sync in AWS Service.', async () => {
    const bucket = domainName;
    const localPath = './target';

    await sut.syncDirectory();

    expect(awsService.syncDirToS3Bucket).toHaveBeenCalledWith(localPath, bucket);
});

test('syncDirectory should invalidate the cloudfront distribution with domain name alias', async () => {
    await sut.syncDirectory();
    expect(awsService.invalidateCloudfrontWithAlias).toHaveBeenCalledWith(domainName)
});
