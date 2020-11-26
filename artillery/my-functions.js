const ITEMS_IDS = ['dcc60382', '36a0c19b', '83f11178', 'uuid1', 'uuid2'];

function isContinue(context, next) {
	const continueLooping = Boolean(Math.round(Math.random()));
	return next(continueLooping); // call back with true to loop again
}

const setJSONBody = (req, context, event, next) => {
	const itemId = ITEMS_IDS[Math.floor(Math.random() * ITEMS_IDS.length)];
	context.vars['itemId'] = itemId;
	context.vars['quantity'] = 1 + Math.round(Math.random() * 5);
	return next();
};

module.exports = {
	isContinue,
	setJSONBody,
};
