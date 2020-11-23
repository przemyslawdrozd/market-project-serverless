const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const transTable = process.env.transTableName;
const { v4 } = require('uuid');

exports.handler = async (event) => {
	try {
		const { cname } = event.pathParameters;

		const item = {
			transId: v4(),
			cname,
			transStatus: 'PROGRESS',
			cart: [],
			totalPrice: 0,
		};

		const params = {
			TableName: transTable,
			Item: item,
		};

		await documentClient.put(params).promise();

		return {
			statusCode: 200,
			body: JSON.stringify(item, null, 2),
		};
	} catch (error) {
		console.log('error ', error.message);
		return {
			statusCode: 400,
			body: error.message,
		};
	}
};
