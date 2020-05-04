
const aws = require('aws-sdk');

jest.mock('aws-sdk');
const s3ClientMock = {
  listBuckets: jest.fn()
}
aws.S3.mockReturnValue(s3ClientMock);

beforeEach(() => {
  jest.resetAllMocks();
  s3ClientMock.listBuckets.mockReturnValue()

  aws.config.credentials = jest.fn();
  aws.config.credentials.expired = false;
})

const sut = require('./awsService');

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

test('verifyBucket should return true if bucket exist with given name', async () => {
  const prom = sut.verifyBucket('bucket');

  reply(s3ClientMock.listBuckets, 0, undefined, {Buckets: [
    {Name: 'bucket'}
  ]});

  const result = await prom;
  expect(result).toBeTruthy();
});

test('verifyBucket should return false if bucket doesnt exist with given name', async () => {
  const prom = sut.verifyBucket('bucket2');

  reply(s3ClientMock.listBuckets, 0, undefined, {Buckets: [
    {Name: 'bucket'}
  ]});

  const result = await prom;
  expect(result).toBeFalsy();
});

function reply(func, argNum, err, data) {
  func.mock.calls[0][argNum](err,data);
}
