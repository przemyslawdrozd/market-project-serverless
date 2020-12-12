// GET /trans/stats
const dynamo = require('../utils/dynamo');
const response = require('../utils/response');

const analyzeTable = process.env.analyzeTableName;
const SEC = 1000;

exports.handler = async (event) => {
	try {
		const analyzeTrans = await dynamo.scan(analyzeTable);

		let sum = 0;
		const parsedTrans = analyzeTrans.map((trans) => {
			const { creationId, totalPrice } = trans;

			const [date, time] = new Date(creationId * SEC)
				.toLocaleString()
				.split(' ');

			const [hour, minute] = time.split(':');
			const resp = {
				date,
				time: `${hour}:${minute}`,
				price: totalPrice,
			};

			sum += totalPrice;
			return resp;
		});

		return response.success({
			totalPrice: sum,
			parsedTrans,
		});
	} catch (error) {
		return response.error(error);
	}
};
