const dynamo = require('../utils/dynamo');
const TABLE_ANALYZE = process.env.analyzeTableName;

const MINUTE = 60;
const UUID = 'uuid'; // todo

const extractRecord = (record) => {
	const body = JSON.parse(record.body);
	const { totalPrice, closedTmp } = JSON.parse(body.Message);
	return {
		totalPrice,
		closedTmp,
	};
};

const updateAnalyzeRecord = async (totalPrice, closedTmp) => {
	let tmp = closedTmp - MINUTE;

	// query
	const result = await dynamo.queryAnalyze(tmp);

	if (result && result.length === 0) {
		const record = {
			analyzeId: UUID,
			creationId: tmp + MINUTE,
			totalPrice: totalPrice,
		};
		await dynamo.put(TABLE_ANALYZE, record);
	} else {
		const { creationId } = result[0];
		await dynamo.updateAnalyze(creationId, totalPrice);
	}
};

const analyzeTrans = async (records) => {
	let total = 0;
	let tmp = 0;
	records.forEach((record) => {
		const { totalPrice, closedTmp } = extractRecord(record);
		total += totalPrice;
		tmp = closedTmp;
	});

	await updateAnalyzeRecord(total, tmp);
};

module.exports = {
	analyzeTrans,
};
