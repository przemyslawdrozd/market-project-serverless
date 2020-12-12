const awsXRay = require('aws-xray-sdk');
const AWS = awsXRay.captureAWS(require('aws-sdk'));
const documentClient = new AWS.DynamoDB.DocumentClient();
const errors = require('./errors');

const TABLE_ANALYZE = process.env.analyzeTableName;
const TABLE_ITEM = process.env.itemTableName;
const TABLE_TRANS = process.env.transTableName;

const scan = (tableName) => {
	return documentClient
		.scan({ TableName: tableName })
		.promise()
		.then((response) => response.Items)
		.catch((error) => {
			throw new errors.ExternalError(error.message);
		});
};

// getItem, getTrans
const getItem = (itemId) => {
	return documentClient
		.get({
			TableName: TABLE_ITEM,
			Key: { itemId },
		})
		.promise()
		.then((response) => response.Item)
		.catch((error) => {
			throw new errors.ExternalError(error.message);
		});
};

const getTrans = (transId) => {
	return documentClient
		.get({
			TableName: TABLE_TRANS,
			Key: { transId },
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
		.catch((error) => {
			throw new errors.ExternalError(error.message);
		});
};

const updateItem = (itemId, quantity) => {
	return documentClient
		.update({
			TableName: TABLE_ITEM,
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
		.promise()
		.then((response) => response.Attributes)
		.catch((error) => {
			if (error.statusCode === 400) {
				throw new errors.BadRequest(error.message);
			}
			throw new errors.ExternalError(error.message);
		});
};

// updateTrans
const updateTrans = (trans) => {
	const { transId, cart, totalPrice } = trans;
	return documentClient
		.update({
			TableName: TABLE_TRANS,
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

const closeTrans = (transId) => {
	console.log('closetrans ', transId);
	return documentClient
		.update({
			TableName: TABLE_TRANS,
			Key: { transId },
			UpdateExpression: 'SET transStatus = :c, closedTmp = :ctmp',
			ConditionExpression: 'transStatus = :s',
			ExpressionAttributeValues: {
				':c': 'CLOSED',
				':s': 'PROGRESS',
				':ctmp': Math.floor(Date.now() / 1000),
			},
			ReturnValues: 'ALL_NEW',
		})
		.promise()
		.then((response) => {
			console.log('then resp ', response);
			return response.Attributes;
		})
		.catch((error) => {
			console.log('catch error ', error);
			if (error.statusCode === 400) {
				throw new errors.BadRequest(error.message);
			}
			throw new errors.ExternalError(error.message);
		});
};

const queryAnalyze = (tmp) => {
	return documentClient
		.query({
			TableName: TABLE_ANALYZE,
			KeyConditionExpression: 'analyzeId = :id and creationId > :tmp',
			ExpressionAttributeValues: {
				':id': 'uuid',
				':tmp': tmp,
			},
		})
		.promise()
		.then((resp) => resp.Items)
		.catch((error) => {
			console.log('catch error ', error);
		});
};

const updateAnalyze = (creationId, totalPrice) => {
	return documentClient
		.update({
			TableName: TABLE_ANALYZE,
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
	getItem,
	getTrans,
	put,
	updateItem,
	updateTrans,
	closeTrans,
	queryAnalyze,
	updateAnalyze,
};
