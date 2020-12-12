// SQS analyze trans records

const errors = require('../utils/errors');
const analyze = require('../service/analyze');

const validateRequest = (request) => {
	const records = request.Records;

	if (!records || records.length === 0) {
		throw new errors.BadRequest('Invalid Record');
	}

	console.log('after validation ', records);
	return records;
};

exports.handler = async (event) => {
	console.log('lambda sqs starts');

	try {
		const request = validateRequest(event);

		await analyze.analyzeTrans(request);

		return {};
	} catch (error) {
		console.log('error ', error.message);
		return {};
	}
};
