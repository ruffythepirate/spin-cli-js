const aws = require('aws-sdk');

const callerReferenceService  = require('./callerReferenceService');


// const s3HighLevel = require('s3');

const s3Client = new aws.S3({
    apiVersion: "2006-03-01"
})
// s3HighLevel.Client = s3Client;

const cloudFrontClient = new aws.CloudFront({
    apiVersion: "2019-03-26"
});

function hasCredentials() {
    return aws.config.credentials && !aws.config.credentials.expired
}

function hasBucket(bucketName) {
    return new Promise(((resolve, reject) => {
        s3Client.listBuckets((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Buckets.find(b => b.Name === bucketName) !== undefined);
            }
        });
    }))
}

function hasDistribution(alias) {
    return getCloudFrontDistribution(alias).then((distribution) => distribution !== undefined)
}

async function getCloudFrontDistribution(alias) {
    return new Promise(((resolve, reject) => {
        cloudFrontClient.listDistributions((err, data) => {
            if (err)
                reject(err);
            else {
                resolve(data.DistributionList.Items.find(d => d.Aliases.Items.includes(alias)));
            }
        });
    }))
}

async function syncDirToS3Bucket(dirPath, bucketName, options = {}) {
    s3HighLevel.Client.sync({});
}

async function invalidateCloudfrontWithAlias(alias) {
    const distributionToInvalidate = await getCloudFrontDistribution(alias);
    return new Promise((resolve, reject) => {
        if (distributionToInvalidate === undefined) {
            reject('No cloudfront distribution found to invalidate');
        } else {
            const callerReference = callerReferenceService.generateReference();
            cloudFrontClient.createInvalidation({
                DistributionId: distributionToInvalidate.Id,
                InvalidationBatch: {
                    CallerReference: callerReference,
                    Paths: {
                        Quantity: 1,
                        Items: ['/*']
                    }
                }
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }
    })
}

module.exports = {
    hasCredentials,
    hasBucket,
    hasDistribution,
    syncDirToS3Bucket,
    invalidateCloudfrontWithAlias
};
