import reqResponses from '../helpers/Responses';

let message;
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
				message = 'firstname field empty';
				return reqResponses.handleError(message, 400, res);
			}
			if (!lastname || lastname === '') {
				message = 'lastname field empty';
				return reqResponses.handleError(message, 400, res);
			}
			if (!address || address === '') {
				message = 'email field empty';
				return reqResponses.handleError(message, 400, res);
			}
			if (!email || email === '') {
				message = 'email field empty';
				return reqResponses.handleError(message, 400, res);
			}
			if (!password || password === '') {
				message = 'password field empty';
				return reqResponses.handleError(message, 400, res);
			}
			if (firstname) {
				re = /[a-zA-Z]{3,}/;
				message = 'enter valid firstname';
				if (!re.test(firstname)) return reqResponses.handleError(message, 400, res);
			}
			if (lastname) {
				re = /[a-zA-Z]{3,}/;
				message = 'enter valid lastname';
				if (!re.test(lastname)) return reqResponses.handleError(message, 400, res);
			}
			if (address) {
				re = /[a-zA-Z]{3,}_*[0-9_]*[a-zA-Z]*_*/;
				message = 'address validation failed';
				if (!re.test(address)) return reqResponses.handleError(message, 400, res);
			}
			if (email) {
				re = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
				message = 'enter valid email e.g user@gmail.com';
				if (!re.test(email)) return reqResponses.handleError(message, 400, res);
			}
			if (password) {
				re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{7,}$/;
				message = 'enter valid password. should be 7 character and more and contain letters and numbers';
				if (!re.test(password)) return reqResponses.handleError(message, 400, res);
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
				message = 'Ensure all fields are filled';
				return reqResponses.handleError(message, 400, res);
			}
			if (email) {
				re = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
				message = 'enter valid email';
				if (!re.test(email) || email === '') return reqResponses.handleError(message, 400, res);
			}
			if (password) {
				re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{7,}$/;
				message = 'enter valid password ';
				if (!re.test(password)) return reqResponses.handleError(message, 400, res);
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
		const { loan } = req.body;

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
