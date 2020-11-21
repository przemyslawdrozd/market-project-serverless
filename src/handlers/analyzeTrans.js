const AWS = require('aws-sdk');

// Comming soon
exports.handler = async (event) => {
	console.log('lambda sqs starts');
	try {
		// console.log('event ', event);

		const { Message } = JSON.parse(event.Records[0].body);
		console.log('trans ', JSON.parse(Message));

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
