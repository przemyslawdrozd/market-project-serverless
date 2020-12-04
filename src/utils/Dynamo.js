const awsXRay = require('aws-xray-sdk');
const AWS = awsXRay.captureAWS(require('aws-sdk'));
const documentClient = new AWS.DynamoDB.DocumentClient();
const errors = require('./errors');

const scan = (tableName) => {
	return documentClient
		.scan({ TableName: tableName })
		.promise()
		.then((response) => response.Items)
		.catch((error) => {
			throw new ExternalError(error.message);
		});
};

// getItem, getTrans
const get = (tableName, itemId) => {
	return documentClient
		.get({
			TableName: tableName,
			Key: { itemId },
		})
		.promise()
		.then((response) => response.Item)
		.catch((error) => {
			throw new errors.ExternalError(error.message);
		});
};

// putItem, putTrans
const put = (tableName, item) => {
	return documentClient
		.put({
			TableName: tableName,
			Item: item,
		})
		.promise()
		.then((result) => {
			console.log('result ', result);
		})
		.catch((error) => {});
};

// updateTrans
const updateTrans = (tableName, trans) => {
	const { transId, cart, totalPrice } = trans;
	return documentClient
		.update({
			TableName: tableName,
			Key: {
				transId,
			},
			UpdateExpression: 'SET cart = :c, totalPrice = :tp',
			ExpressionAttributeValues: {
				':c': cart,
				':tp': totalPrice,
			},
		})
		.promise();
};

const updateItem = async (tableName, itemId, quantity) => {
	return documentClient
		.update({
			TableName: tableName,
			Key: {
				itemId,
			},
			UpdateExpression: 'SET quantity = quantity - :q',
			ConditionExpression: 'quantity >= :q',
			ExpressionAttributeValues: {
				':q': quantity,
			},
			ReturnValues: 'ALL_NEW',
		})
		.promise();
};

const updateAnalyze = (tableName, creationId, totalPrice) => {
	return documentClient
		.update({
			TableName: tableName,
			Key: {
				analyzeId: 'uuid',
				creationId: creationId,
			},
			UpdateExpression: 'SET totalPrice = totalPrice + :tp',
			ExpressionAttributeValues: {
				':tp': totalPrice,
			},
		})
		.promise();
};

const loadBatchItems = (tableName, batch) => {
	documentClient
		.batchWrite({
			RequestItems: {
				[tableName]: batch,
			},
		})
		.promise();
};

module.exports = {
	scan,
	get,
};
