const awsXRay = require('aws-xray-sdk');
const AWS = awsXRay.captureAWS(require('aws-sdk'));
const documentClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.itemTableName;
const { itemNames } = require('../utils/itemNames');
exports.handler = async (event) => {
	try {
		console.log('init items..');
		const requests = [];

		itemNames.map((name, i) => {
			requests.push({
				PutRequest: {
					Item: {
						itemId: `uuid${i + 1}`,
						title: name,
						price: Number((Math.random() * 30).toFixed(2)),
						quantity: 1000,
					},
				},
			});
		});

		const batches = [];
		let batchRequests = [];
		let offSet = 25;
		const size = requests.length;

		for (let i = 0; i < size; i++) {
			// put 25 requests
			if (i !== offSet) {
				batchRequests.push(requests[i]);

				// check if last request
				if (i === size - 1) {
					batches.push(batchRequests);
				}
				continue;
			}

			// put BatchRequest in batches
			batches.push(batchRequests);

			// clean up for next iteration
			batchRequests = [];

			// put current request
			batchRequests.push(requests[i]);

			// increment offset
			offSet += offSet;
		}

		// console.log('batches ', batches);

		for (let i = 0; i < batches.length; i++) {
			let params = {
				RequestItems: {
					[tableName]: batches[i],
				},
			};

			let result = await documentClient
				.batchWrite(params)
				.promise()
				.catch((error) => {
					console.log('error, ', error);
				});
			console.log('result ', result);
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				batches,
			}),
		};
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify(error),
		};
	}
};
