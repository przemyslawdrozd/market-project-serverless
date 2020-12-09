// GET /item/{id}
const { dynamo, errors, response } = require('../utils/dynamo');

const TABLE_ITEM = process.env.itemTableName;
const ALL = 'all';

// example
const validateRequest = (request) => {
	const { id } = request.pathParameters;

	if (!id) {
		throw new errors.BadRequest('Invalid path variable');
	}
};

exports.handler = async (event) => {
	try {
		validateRequest(event);

		const itemId = event.pathParameters.id;
		let result;

		if (itemId === ALL) {
			result = await dynamo.scan(TABLE_ITEM);
		} else {
			result = await dynamo.getItem(itemId);
		}

		if (!result) {
			throw new errors.NotFound(`Invalid key: ${itemId}`);
		}

		return response.success(result);
	} catch (error) {
		return response.error(error);
	}
};
