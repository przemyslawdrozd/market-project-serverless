const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');
const FILE_PATH = __dirname + '/deployment.yml';
let BASE_URL = '';

function initBaseUrl() {
	try {
		let file = fs.readFileSync(FILE_PATH, 'utf-8');
		const { baseUrl, stage } = yaml.safeLoad(file);
		BASE_URL = `${baseUrl}/${stage}/`;
	} catch (error) {
		throw new Error('Something went wrong reading file..');
	}
}

const putItem = (request) => {
	return axios
		.post(BASE_URL + 'item', request)
		.then((resp) => resp)
		.catch((error) => error.response);
};

const getItem = (id) => {
	return axios
		.get(BASE_URL + 'item/' + id)
		.then((resp) => resp)
		.catch((error) => error.response);
};

module.exports = {
	initBaseUrl,
	putItem,
	getItem,
};
