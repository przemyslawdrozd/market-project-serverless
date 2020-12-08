const dynamo = require('../utils/dynamo');
const { BadRequest } = require('../utils/errors');

const getTransaction = async (transId) => {
	const trans = await dynamo.getTrans(transId);

	if (!trans || trans.transStatus !== 'PROGRESS') {
		throw new BadRequest('This transaction is not in progress');
	}

	return trans;
};

const addPayment = (trans, price, quantity) => {
	let { totalPrice } = trans;
	const increasePrice = price * quantity;
	totalPrice = totalPrice + increasePrice;
	trans.totalPrice = Number(totalPrice.toFixed(2));
};

const putProductIntoBasket = async ({ transId, itemId, quantity }) => {
	const trans = await getTransaction(transId);

	const { title, price } = await dynamo.updateItem(itemId, quantity);

	const basketItem = trans.cart.find((product) => product.itemId === itemId);

	if (basketItem) {
		basketItem.quantity += quantity;
	} else {
		trans.cart.push({ itemId, title, quantity, price });
	}

	addPayment(trans, price, quantity);

	await dynamo.updateTrans(trans);

	return trans;
};

module.exports = {
	putProductIntoBasket,
};
