// POST /trans/create/{cname}

const dynamo = require('../utils/dynamo');
const response = require('../utils/response');
const { v4 } = require('uuid');

const transTable = process.env.transTableName;

const createTransModel = (cname) => ({
	transId: v4(),
	cname,
	transStatus: 'PROGRESS',
	cart: [],
	totalPrice: 0,
});

exports.handler = async (event) => {
	try {
		const { cname } = event.pathParameters;

		const item = createTransModel(cname);

		await dynamo.put(transTable, item);

		return response.success({
			message: 'success',
			newItem: item,
		});
	} catch (error) {
		return response.error(error);
	}
};
