const awsXRay = require('aws-xray-sdk');
const AWS = awsXRay.captureAWS(require('aws-sdk'));
const documentClient = new AWS.DynamoDB.DocumentClient();
const SNS = new AWS.SNS();
const transTable = process.env.transTableName;
const snsTopic = process.env.snsCloseTrans;

const updateTrans = async (transId) => {
	const params = {
		TableName: transTable,
		Key: {
			transId,
		},
		UpdateExpression: 'SET transStatus = :c',
		ConditionExpression: 'transStatus = :s',
		ExpressionAttributeValues: {
			':c': 'CLOSED',
			':s': 'PROGRESS',
		},
		ReturnValues: 'ALL_NEW',
	};
	return documentClient.update(params).promise();
};

const paymentProcessing = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

exports.handler = async (event) => {
	try {
		// extract transId and item
		const { transId } = event.pathParameters;

		await paymentProcessing(3000);

		// update trans to close if exists
		const trans = await updateTrans(transId);

		const params = {
			Message: JSON.stringify(trans.Attributes),
			TopicArn: snsTopic,
		};

		await SNS.publish(params).promise();

		return {
			statusCode: 200,
			body: JSON.stringify(trans, null, 2),
		};
		// return message
	} catch (error) {
		console.log('error ', error.message);
		return {
			statusCode: 400,
			body: error.message,
		};
	}
};
