const awsXRay = require('aws-xray-sdk');
const AWS = awsXRay.captureAWS(require('aws-sdk'));
const documentClient = new AWS.DynamoDB.DocumentClient();
const analyzeTable = process.env.analyzeTableName;
const SEC = 1000;

exports.handler = async (event) => {
	try {
		console.log('scan analyze table');
		const analyzeTrans = await documentClient
			.scan({ TableName: analyzeTable })
			.promise();

		let sum = 0;
		const parsedTrans = analyzeTrans.Items.map((trans) => {
			const { creationId, totalPrice } = trans;
			sum += totalPrice;
			const [date, time] = new Date(creationId * SEC)
				.toLocaleString()
				.split(',');

			const [day, month] = date.split('/');
			const [hour, min] = time.split(':');
			return {
				date: `${month}/${day} ${hour}:${min}`,
				price: totalPrice,
			};
		});

		return {
			statusCode: 200,
			body: JSON.stringify({
				totalPrice: sum,
				parsedTrans,
			}),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify(error),
		};
	}
};
