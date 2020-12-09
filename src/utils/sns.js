const awsXRay = require('aws-xray-sdk');
const AWS = awsXRay.captureAWS(require('aws-sdk'));
const SNS = new AWS.SNS();

const { ExternalError } = require('./errors');
const SNS_TOPIC = process.env.snsCloseTrans;

const publishClosedTrans = (trans) => {
	SNS.publish({
		Message: JSON.stringify(trans),
		TopicArn: SNS_TOPIC,
	})
		.promise()
		.catch((error) => {
			throw new ExternalError(error.message);
		});
};

module.exports = {
	publishClosedTrans,
};
