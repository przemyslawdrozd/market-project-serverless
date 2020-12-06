// POST /item
const tableName = process.env.itemTableName;
const { v4 } = require('uuid');

const dynamo = require('../utils/Dynamo');
const { BadRequest } = require('../utils/errors');

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
	console.log('putItem start');
	try {
		const newItem = validateRequest(event);
		newItem.itemId = v4();

		await dynamo.put(tableName, newItem);
		return {
			statusCode: 200,
			body: JSON.stringify(newItem),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify(error),
		};
	}
};
