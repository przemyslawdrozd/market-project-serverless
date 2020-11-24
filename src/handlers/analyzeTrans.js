const awsXRay = require('aws-xray-sdk');
const AWS = awsXRay.captureAWS(require('aws-sdk'));
const documentClient = new AWS.DynamoDB.DocumentClient();
const analyzeTable = process.env.analyzeTableName;
const MINUTE = 60;
const extractRecord = (record) => {
	const body = JSON.parse(record.body);
	return JSON.parse(body.Message).totalPrice;
};

const updateAnalyzeRecord = async (totalPrice) => {
	let tmp = Math.floor(Date.now() / 1000) - MINUTE;
	console.log('tmp - min: ', tmp);
	console.log('analyzeTable ', analyzeTable);

	// query
	const params = {
		TableName: analyzeTable,
		KeyConditionExpression: 'analyzeId = :id and creationId > :tmp',
		ExpressionAttributeValues: {
			':id': 'uuid',
			':tmp': tmp,
		},
	};
	const result = await documentClient.query(params).promise();
	console.log('result ', result);

	if (result && result.Items.length === 0) {
		console.log('non items found: ', result.Items);
		// put record
		tmp += MINUTE;
		const putParams = {
			TableName: analyzeTable,
			Item: {
				analyzeId: 'uuid',
				creationId: tmp,
				totalPrice: totalPrice,
			},
		};

		const putResult = await documentClient.put(putParams).promise();
		console.log('putResult ', putResult);
	} else {
		// update
		console.log('to update ', result);
		const { creationId } = result.Items[0];
		const updateParams = {
			TableName: analyzeTable,
			Key: {
				analyzeId: 'uuid',
				creationId: creationId,
			},
			UpdateExpression: 'SET totalPrice = totalPrice + :tp',
			ExpressionAttributeValues: {
				':tp': totalPrice,
			},
		};
		await documentClient.update(updateParams).promise();
		console.log('updated');
	}
};

exports.handler = async (event) => {
	console.log('lambda sqs starts');
	try {
		console.log('event record body ', event.Records[0].body);

		let totalPrice = 0;
		event.Records.forEach((record) => {
			totalPrice += extractRecord(record);
		});
		console.log('totalPrice ', totalPrice);

		// update Record
		const response = await updateAnalyzeRecord(totalPrice);

		console.log('response ', response);
		return {
			// statusCode: 200,
			// body: JSON.stringify(item, null, 2),
		};
	} catch (error) {
		console.log('error ', error.message);
		return {
			// statusCode: 400,
			// body: error.message,
		};
	}
};
