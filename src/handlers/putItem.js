// POST /item

const dynamo = require('../utils/dynamo');
const response = require('../utils/response');
const errors = require('../utils/errors');
const { v4 } = require('uuid');

const tableName = process.env.itemTableName;
const TITLE_REGEX = /^[A-Za-z ]+$/;

const validateRequest = (request) => {
	let newItem = request.body;

	if (!request.body) {
		throw new errors.BadRequest('invalid body');
	}

	newItem = JSON.parse(newItem);
	const { title, price, quantity } = newItem;

	if (!title || !TITLE_REGEX.test(title)) {
		throw new errors.BadRequest(`Invalid title: ${title}`);
	}

	if (!price || price <= 0) {
		throw new errors.BadRequest(`Invalid price: ${price}`);
	}

	if (!quantity || quantity <= 0) {
		throw new errors.BadRequest(`Invalid quantity: ${quantity}`);
	}

	return newItem;
};

exports.handler = async (event) => {
	try {
		const newItem = validateRequest(event);

		const productId = v4();
		newItem.itemId = productId;

		await dynamo.put(tableName, newItem);

		return response.success({
			productId,
		});
	} catch (error) {
		return response.error(error);
	}
};
