const AWS = require('aws-sdk');

// Comming soon
exports.handler = async (event) => {
	try {
		const { Message } = event.Records[0].Sns;

		console.log(JSON.parse(Message));
		return {
			statusCode: 200,
			// body: JSON.stringify(item, null, 2),
		};
	} catch (error) {
		console.log('error ', error.message);
		return {
			statusCode: 400,
			body: error.message,
		};
	}
};
