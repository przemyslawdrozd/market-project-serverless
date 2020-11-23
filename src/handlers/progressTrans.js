const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const transTable = process.env.transTableName;
const itemTable = process.env.itemTableName;

const getTrans = async (transId) => {
	const params = {
		TableName: transTable,
		Key: {
			transId,
		},
	};
	const { Item: trans } = await documentClient.get(params).promise();

	if (!trans || trans.transStatus !== 'PROGRESS') {
		throw new Error('This transaction is not in progress');
	}

	return trans;
};

const updateTrans = async (trans) => {
	const { transId, cart, totalPrice } = trans;
	const params = {
		TableName: transTable,
		Key: {
			transId,
		},
		UpdateExpression: 'SET cart = :c, totalPrice = :tp',
		ExpressionAttributeValues: {
			':c': cart,
			':tp': totalPrice,
		},
	};
	return documentClient.update(params).promise();
};

const updateItem = async (itemId, quantity) => {
	const params = {
		TableName: itemTable,
		Key: {
			itemId,
		},
		UpdateExpression: 'SET quantity = quantity - :q',
		ConditionExpression: 'quantity >= :q',
		ExpressionAttributeValues: {
			':q': quantity,
		},
		ReturnValues: 'ALL_NEW',
	};
	return documentClient.update(params).promise();
};

exports.handler = async (event) => {
	try {
		// extract transId and item
		const { transId } = event.pathParameters;
		const { itemId, quantity } = JSON.parse(event.body);

		if (quantity < 0) {
			throw new Error('invalid quantity');
		}

		// Get current trans if exists and if transStatus in progress
		const trans = await getTrans(transId);
		console.log('trans ', trans);

		// decrease quantity of taken item
		const result = await updateItem(itemId, quantity);
		// console.log('result ', result);

		const { price, title } = result.Attributes;

		// update trans TODO check to not clone same item
		const cItem = trans.cart.find((item) => item.itemId === itemId);

		if (cItem) {
			console.log('cItem found', cItem.title);
			cItem.quantity += quantity;
		} else {
			console.log('cItem not found found');
			trans.cart.push({
				itemId,
				title,
				quantity,
				price,
			});
		}

		// addPayment
		let { totalPrice } = trans;

		const increasePrice = price * quantity;

		totalPrice = totalPrice + increasePrice;
		trans.totalPrice = Number(totalPrice.toFixed(2));

		await updateTrans(trans);

		return {
			statusCode: 200,
			body: JSON.stringify(trans, null, 2),
		};
	} catch (error) {
		console.log('error ', error.message);
		return {
			statusCode: 400,
			body: error.message,
		};
	}
};
