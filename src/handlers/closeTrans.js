const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const transTable = process.env.transTableName;

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

		console.log('start payment');
		await paymentProcessing(4000);
		console.log('finish payment');

		// update trans to close if exists
		const trans = await updateTrans(transId);

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
