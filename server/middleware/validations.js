import reqResponses from '../helpers/Responses';

class Validations {
	static async validatesignup(req, res, next) {
		try {
			const {
				firstname,
				lastname,
				address,
				email,
				password,
			} = req.body;

			let re;

			if (!firstname || firstname === '') {
				return reqResponses.handleError(400, 'firstname field empty', res);
			}
			if (!lastname || lastname === '') {
				return reqResponses.handleError(400, 'lastname field empty', res);
			}
			if (!address || address === '') {
				return reqResponses.handleError(400, 'email field empty', res);
			}
			if (!email || email === '') {
				return reqResponses.handleError(400, 'email field empty', res);
			}
			if (!password || password === '') {
				return reqResponses.handleError(400, 'password field empty', res);
			}
			if (firstname) {
				re = /[a-zA-Z]{3,}/;
				if (!re.test(firstname)) return reqResponses.handleError(400, 'enter valid firstname', res);
			}
			if (lastname) {
				re = /[a-zA-Z]{3,}/;
				if (!re.test(lastname)) return reqResponses.handleError(400, 'enter valid lastname', res);
			}
			if (address) {
				re = /[a-zA-Z]{3,}_*[0-9_]*[a-zA-Z]*_*/;
				if (!re.test(address)) return reqResponses.handleError(400, 'address validation failed', res);
			}
			if (email) {
				re = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
				if (!re.test(email)) return reqResponses.handleError(400, 'enter valid email e.g user@gmail.com', res);
			}
			if (password) {
				re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{7,}$/;
				if (!re.test(password)) return reqResponses.handleError(400, 'enter valid password. should be 7 character and more and contain letters and numbers', res);
			}
			next();
		} catch (error) {
			return reqResponses.handleError(error.toString(), 500, res);
		}
	}

	static async validatelogin(req, res, next) {
		try {
			const {
				email,
				password,
			} = req.body;

			let re;
			if (email === '' || password === '' || !email || !password) {
				return reqResponses.handleError(400, 'Ensure all fields are filled', res);
			}
			if (email) {
				re = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
				if (!re.test(email) || email === '') return reqResponses.handleError(400, 'enter valid email', res);
			}
			next();
		} catch (error) {
			return reqResponses.handleError(error.toString(), 500, res);
		}
	}

	static async validateID(req, res, next) {
		try {
			const {
				id,
			} = req.params;
			const re = /^[a-zA-Z]/;
			if (id) {
				if (id === '*' || id === '@' || id === '+' || id === '--' || re.test(id)) {
					return res.status(404).json({
						message: 'Your url is invalid',
					});
				}
			}
			next();
		} catch (error) {
			return reqResponses.handleError(error.toString(), 500, res);
		}
	}

	static async validateLoan(req, res, next) {
		const loan = req.body.amount;

		let re;

		if (!loan || loan === '') {
			return res.status(400).json({
				status: 400,
				message: 'loan field required',
			});
		}
		if (loan) {
			re = /[0-9_]{3,}/;
			if (!re.test(loan)) {
				return res.status(400).json({
					message: 'enter 3 digits or more',
				});
			}
		}
		next();
	}
}
export default Validations;
