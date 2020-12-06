const dynamo = require('../utils/Dynamo');
const { NotFound, BadRequest } = require('../utils/errors');

const tableName = process.env.itemTableName; // think

// example
const validateRequest = (request) => {
	const { id } = request.pathParameters;

	if (!id) {
		throw new BadRequest('Invalid path variable');
	}
};

exports.handler = async (event) => {
	console.log('getItem start');
	try {
		validateRequest(event);

		const itemId = event.pathParameters.id;
		let result;
		if (itemId === 'all') {
			result = await dynamo.scan(tableName);
		} else {
			result = await dynamo.get(tableName, itemId);
			console.log('reuslt ', result);
		}

		if (!result) {
			throw new NotFound(`Invalid key: ${itemId}`);
		}

		return {
			statusCode: 200,
			body: JSON.stringify(result, null, 2),
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: error.statusCode,
			body: JSON.stringify(error),
		};
	}
};
