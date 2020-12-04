const tableName = process.env.itemTableName;
const dynamo = require('../utils/Dynamo');
const { NotFound } = require('../utils/errors');

exports.handler = async (event) => {
	console.log('getItem start');
	try {
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
