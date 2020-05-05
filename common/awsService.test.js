const aws = require('aws-sdk');
jest.mock('aws-sdk');
const s3ClientMock = {
    listBuckets: jest.fn()
}
const cloudFrontClientMock = {
    listDistributions: jest.fn(),
    createInvalidation: jest.fn()
}

aws.S3.mockReturnValue(s3ClientMock);
aws.CloudFront.mockReturnValue(cloudFrontClientMock);

const callerReferenceService = require('./callerReferenceService');
jest.mock('./callerReferenceService');

const sut = require('./awsService');
beforeEach(() => {
    jest.resetAllMocks();

    aws.config.credentials = jest.fn();
    aws.config.credentials.expired = false;
});

test('hasCredentials should return true when credentials is not null and expired is false', () => {
    const result = sut.hasCredentials();

    expect(result).toBeTruthy();
});

test('hasCredentials should return false when credentials are undefined', () => {
    aws.config.credentials = undefined;

    const result = sut.hasCredentials();

    expect(result).toBeFalsy();
});

test('hasCredentials should return false when credentials are expired', () => {
    aws.config.credentials.expired = true;

    const result = sut.hasCredentials();

    expect(result).toBeFalsy();
});

test('hasBucket should return true if bucket exist with given name', async () => {
    const prom = sut.hasBucket('bucket');

    reply(s3ClientMock.listBuckets, 0, undefined, {
        Buckets: [
            {Name: 'bucket'}
        ]
    });

    const result = await prom;
    expect(result).toBeTruthy();
});

test('hasBucket should return false if bucket doesnt exist with given name', async () => {
    const prom = sut.hasBucket('bucket2');

    reply(s3ClientMock.listBuckets, 0, undefined, {
        Buckets: [
            {Name: 'bucket'}
        ]
    });

    const result = await prom;
    expect(result).toBeFalsy();
});

test('hasBucket should throw if s3 operation fails', async () => {
    const prom = sut.hasBucket('bucket2');
    reply(s3ClientMock.listBuckets, 0, 'an error', undefined);
    await expect(prom).rejects.toBeTruthy();
});

test('hasDistribution should throw if cloudfront operation fails', async () => {
    const prom = sut.hasDistribution('bucket2');
    reply(cloudFrontClientMock.listDistributions, 0, 'an error', undefined);
    await expect(prom).rejects.toBeTruthy();
});

test('hasDistribution should return true when distribution with alias exists', async () => {
    const prom = sut.hasDistribution('bucket');
    reply(cloudFrontClientMock.listDistributions, 0, undefined, {
        DistributionList: {
            Items: [
                {
                    Aliases: {Items: ['hello', 'bucket']}
                }
            ]
        }
    });
    const result = await prom;
    expect(result).toBeTruthy();
});

test('hasDistribution should return false when distribution doesnt exist', async () => {
    const prom = sut.hasDistribution('bucket2');
    reply(cloudFrontClientMock.listDistributions, 0, undefined, mockDistributionList(['hello', 'bucket']));
    const result = await prom;
    expect(result).toBeFalsy();
});

test('invalidateCloudfrontWithAlias should call invalidate with correct arguments', async () => {
    const distributionId = 'EAX123123';
    const alias = 'bucket';
    callerReferenceService.generateReference.mockReturnValue('ref');

    const prom = sut.invalidateCloudfrontWithAlias(alias);

    reply(cloudFrontClientMock.listDistributions, 0, undefined, mockDistributionList([alias], distributionId));
    replyDirect(cloudFrontClientMock.createInvalidation, 1, undefined, true);
    await prom;

    expect(cloudFrontClientMock.createInvalidation).toHaveBeenCalledWith({
        DistributionId: distributionId,
        InvalidationBatch: {
            CallerReference: 'ref',
            Paths: {
                Quantity: 1,
                Items: ['/*']
            }
        }
    }, expect.any(Function));
});

function mockDistributionList(aliases, distId) {
    return {
        DistributionList: {

            Items: [
                {
                    Id: distId,
                    Aliases: {Items: aliases}
                }
            ]
        }
    }
}

function reply(func, argNum, err, data) {
    func.mock.calls[0][argNum](err, data);
}

function replyDirect(func, argNum, err, data) {
    func.mockImplementationOnce(function()  {
        arguments[argNum](err, data)
    });
}
