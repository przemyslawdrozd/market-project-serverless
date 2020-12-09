// POST /trans/close/{transId}
const { dynamo, response, sns } = require('../utils');

const paymentProcessing = (ms) =>
	new Promise((resolve) => setTimeout(resolve, ms));

exports.handler = async (event) => {
	try {
		const { transId } = event.pathParameters;

		await paymentProcessing(1000);

		const trans = await dynamo.closeTrans(transId);

		await sns.publishClosedTrans(trans);

		return response.success(trans);
	} catch (error) {
		return response.error(error);
	}
};
