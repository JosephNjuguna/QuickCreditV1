class Responses {
	static handleSuccess(res, message) {
		res.status(message[0]).json({
			success: message[2],
			message: message[1],
		});
	}

	static handleError(message, statusCode, res) {
		res.status(statusCode).json({
			success: false,
			message,
		});
	}
}

module.exports = Responses;
