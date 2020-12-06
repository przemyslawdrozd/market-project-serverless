// GET /item/{id}
const dynamo = require('../utils/Dynamo');
const { NotFound, BadRequest } = require('../utils/errors');
const response = require('../utils/response');

const tableName = process.env.itemTableName; // think

// example
const validateRequest = (request) => {
	const { id } = request.pathParameters;

	if (!id) {
		throw new BadRequest('Invalid path variable');
	}
};

exports.handler = async (event) => {
	try {
		validateRequest(event);

		const itemId = event.pathParameters.id;
		let result;

		if (itemId === 'all') {
			result = await dynamo.scan(tableName);
		} else {
			result = await dynamo.get(tableName, itemId);
		}

		if (!result) {
			throw new NotFound(`Invalid key: ${itemId}`);
		}

		return response.success(result);
	} catch (error) {
		return response.error(error);
	}
};
