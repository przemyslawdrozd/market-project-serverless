// POST /item/load

const dynamo = require('../utils/dynamo');
const response = require('../utils/response');
const { productNames } = require('../assets/productNames');

const createRequests = () => {
	return productNames.reduce((acc, name, i) => {
		acc.push({
			PutRequest: {
				Item: {
					itemId: `uuid${i + 1}`,
					title: name,
					price: Number((Math.random() * 30).toFixed(2)),
					quantity: 1000,
				},
			},
		});
		return acc;
	}, []);
};

const createBatches = (requests) => {
	const batches = []; // batch of 25 requests
	let batchRequests = []; // list of batches to put
	let offSet = 25;

	requests.forEach((request, i) => {
		// put 25 requests
		if (i !== offSet) {
			batchRequests.push(request);

			// check if last request
			if (i === requests.length - 1) {
				batches.push(batchRequests);
			}
			return;
		}
		// put BatchRequest in batches
		batches.push(batchRequests);

		// clean up for next iteration
		batchRequests = [];

		// put current request
		batchRequests.push(request);

		// increment offset
		offSet += offSet;
	});

	return batches;
};

exports.handler = async (event) => {
	try {
		const requests = createRequests();

		const batches = createBatches(requests);

		batches.forEach((batch) => dynamo.putBatch(batch));

		return response.success({
			message: `Success - put ${requests.length} products`,
		});
	} catch (error) {
		return response.error(error);
	}
};
