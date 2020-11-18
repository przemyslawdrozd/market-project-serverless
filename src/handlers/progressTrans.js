const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const transTable = process.env.transTableName;
const itemTable = process.env.itemTableName;

exports.handler = async (event) => {
	try {
		// extract transId and item
		const { transId } = event.pathParameters;
		const { itemId, quantity } = JSON.parse(event.body);

		// Get current trans if exists and if status in progress
		let params = {
			TableName: transTable,
			Key: {
				transId,
			},
		};
		let { Item: trans } = await documentClient.get(params).promise();
		console.log('trans ', trans);

		if (!trans || trans.status !== 'PROGRESS') {
			throw new Error('This transaction is not in progress');
		}

		params = {
			TableName: itemTable,
			Key: {
				itemId,
			},
			UpdateExpression: 'SET quantity = quantity - :q',
			ConditionExpression: 'quantity >= :q',
			ExpressionAttributeValues: {
				':q': quantity,
			},
		};

		// decrease quantity of taken item
		const result = await documentClient.update(params).promise();
		console.log('result ', result);

		// TODO create resposne

		return {
			statusCode: 200,
			body: JSON.stringify(trans, null, 2),
		};
	} catch (error) {
		console.log('error ', error.message);
		return {
			statusCode: 400,
			body: error.message,
		};
	}
};
