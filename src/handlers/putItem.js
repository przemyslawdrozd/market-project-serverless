// POST /item

const dynamo = require('../utils/dynamo');
const { BadRequest } = require('../utils/errors');
const response = require('../utils/response');
const { v4 } = require('uuid');

const tableName = process.env.itemTableName;
const TITLE_REGEX = /^[A-Za-z ]+$/;

const validateRequest = (request) => {
	let newItem = request.body;

	if (!request.body) {
		throw new BadRequest('invalid body');
	}

	newItem = JSON.parse(newItem);
	const { title, price, quantity } = newItem;

	if (!title || !TITLE_REGEX.test(title)) {
		throw new BadRequest(`Invalid title: ${title}`);
	}

	if (!price || price <= 0) {
		throw new BadRequest(`Invalid price: ${price}`);
	}

	if (!quantity || quantity <= 0) {
		throw new BadRequest(`Invalid quantity: ${quantity}`);
	}

	return newItem;
};

exports.handler = async (event) => {
	try {
		const newItem = validateRequest(event);
		newItem.itemId = v4();

		await dynamo.put(tableName, newItem);

		return response.success({
			message: 'success',
		});
	} catch (error) {
		return response.error(error);
	}
};
