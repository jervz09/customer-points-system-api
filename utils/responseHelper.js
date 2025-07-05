export default (req, res, next) => {
	res.success = (data = null, message = 'Success') => {
		if (res.headersSent) return;
		const response = {
			status: 'success',
			message: typeof message === 'string' ? message : 'Success',
		};
		if (data !== null) response.data = data;
		res.json(response);
	};

	res.error = (message = 'Error', statusCode = 500, errors = null) => {
		if (res.headersSent) return;
		const response = {
			status: 'error',
			message: typeof message === 'string' ? message : 'Error',
		};
		if (errors && Array.isArray(errors)) response.errors = errors;
		res.status(statusCode).json(response);
	};

	next();
};
