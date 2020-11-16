const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const transTable = process.env.transTableName;
const { v4 } = require('uuid');
const transTypes = ['open', 'progress', 'close'];

const openTrans = async (cname) => {
	const item = {
		transId: v4(),
		cname,
		status: 'PROGRESS',
		items: [],
		toPay: 0,
	};
	const params = {
		TableName: transTable,
		Item: item,
	};

	const result = await documentClient.put(params).promise();
	console.log('result ', result);
	return { item };
};

const progressTrans = (cname) => {
	//TODO transaction process
};

const closeTrans = (cname) => {};

exports.handler = async (event) => {
	try {
		const { type, cname } = event.pathParameters;

		if (!transTypes.includes(type)) {
			throw Error('invalid type');
		}

		let transResult;

		switch (type) {
			case 'open':
				transResult = openTrans(cname);
				break;
			case 'progress':
		}

		return {
			statusCode: 200,
			body: JSON.stringify(transResult, null, 2),
		};
	} catch (error) {
		console.log('error ', error.message);
		return {
			statusCode: 400,
			body: error.message,
		};
	}
};
