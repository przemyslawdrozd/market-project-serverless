const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.itemTableName;

exports.handler = async (event) => {
	try {
		const newItem = JSON.parse(event.body);
		console.log('newItem ', newItem);
		console.log('tableName ', tableName);

		newItem.itemId = 'uuid5';
		const params = {
			TableName: tableName,
			Item: newItem,
		};
		const result = await documentClient.put(params).promise();
		console.log('result ', result);
		return {
			statusCode: 200,
			body: JSON.stringify(newItem),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify(error),
		};
	}
};
