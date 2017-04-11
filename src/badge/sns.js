var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAJIBRDEMRXRCQ73DQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

var sns = new AWS.SNS();

const payload = (text, count) =>
    JSON.stringify({
        default: text,
        APNS: JSON.stringify({ aps: {
            sound: 'default',
            alert: text,
            badge: count
        }})
    })

const publish = endpointArn => (text, count) =>
    new Promise((res, rej) =>
        sns.publish({
            Message: payload(text, count),
            MessageStructure: 'json',
            TargetArn: endpointArn
        }, (err, data) => {
            if (err) return rej(err);
            res(data);
        }))

module.exports = token =>
    new Promise((res, rej) =>
        sns.createPlatformEndpoint({
            PlatformApplicationArn: '{APPLICATION_ARN}',
            Token: token
        }, (err, data) => {
            if (err) return rej(err);
            res(data.EndpointArn)
        }))
        .then(publish);