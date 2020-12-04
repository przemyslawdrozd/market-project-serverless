class NotFound extends Error {
	constructor(info, code = 404) {
		super(code);
		this.statusCode = code;
		this.name = this.constructor.name;
		this.info = info;
		console.log(this.name, info);
	}
}

class ExternalError extends Error {
	constructor(info, code = 500) {
		super(code);
		this.statusCode = code;
		this.name = this.constructor.name;
		this.info = info;
		console.log(this.name, info);
	}
}

module.exports = {
	NotFound,
	ExternalError,
};
