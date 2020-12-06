class NotFound extends Error {
	constructor(info) {
		super();
		this.statusCode = 404;
		this.name = this.constructor.name;
		this.info = info;
		console.log(this.name, info);
	}
}

class BadRequest extends Error {
	constructor(info) {
		super();
		this.statusCode = 400;
		this.name = this.constructor.name;
		this.info = info;
		console.log(this.name, info);
	}
}

class ExternalError extends Error {
	constructor(info) {
		super();
		this.statusCode = 500;
		this.name = this.constructor.name;
		this.info = info;
		console.log(this.name, info);
	}
}

module.exports = {
	NotFound,
	ExternalError,
	BadRequest,
};
