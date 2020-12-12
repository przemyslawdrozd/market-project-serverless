// Response api handler
const success = (data) => {
	return {
		// headers: {
		// 	'Content-Type': 'application/json',
		// 	'Access-Control-Allow-Methods': '*',
		// 	'Access-Control-Allow-Origin': '*',
		// },
		statusCode: 200,
		body: JSON.stringify(data),
	};
};

const error = (error) => {
	return {
		// headers: {
		// 	'Content-Type': 'application/json',
		// 	'Access-Control-Allow-Methods': '*',
		// 	'Access-Control-Allow-Origin': '*',
		// },
		statusCode: error.statusCode || 500,
		body: JSON.stringify(error),
	};
};

module.exports = {
	success,
	error,
};
