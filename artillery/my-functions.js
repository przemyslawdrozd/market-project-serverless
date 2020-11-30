function isContinue(context, next) {
	const continueLooping = Boolean(Math.round(Math.random()));
	return next(continueLooping); // call back with true to loop again
}

const setJSONBody = (req, context, event, next) => {
	const id = Math.round(Math.random() * 50); // +5 for error codes
	const itemId = `uuid${id}`;
	context.vars['itemId'] = itemId;
	context.vars['quantity'] = 1 + Math.round(Math.random() * 5);
	return next();
};

module.exports = {
	isContinue,
	setJSONBody,
};
