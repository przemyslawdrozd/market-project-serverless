const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.itemTableName;

exports.handler = async (event) => {
	try {
		const itemId = event.pathParameters.id;
		let result;
		if (itemId === 'all') {
			result = await documentClient.scan({ TableName: tableName }).promise();
		} else {
			const params = {
				TableName: tableName,
				Key: {
					itemId,
				},
			};
			result = await documentClient.get(params).promise();
		}
		console.log('result ', result);
		return {
			statusCode: 200,
			body: JSON.stringify(result, null, 2),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify(error),
		};
	}
};
