// POST trans/{transId}

const response = require('../utils/response');
const errors = require('../utils/errors');
const transaction = require('../service/transaction');

const validateRequest = (request) => {
	const { transId } = request.pathParameters;
	const { itemId, quantity } = JSON.parse(request.body);

	if (!itemId) {
		throw new errors.BadRequest('invalid item id');
	}

	if (!quantity || quantity <= 0) {
		throw new errors.BadRequest('Invalid quantity');
	}

	return { transId, itemId, quantity };
};

exports.handler = async (event) => {
	try {
		const request = validateRequest(event);

		const trans = await transaction.putProductIntoBasket(request);

		return response.success(trans);
	} catch (error) {
		return response.error(error);
	}
};
