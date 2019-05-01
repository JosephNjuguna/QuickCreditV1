import jwt from 'jsonwebtoken';
import Models from '../models/Loans';
import Date from '../helpers/Date';
import LoanID from '../helpers/Uid';

const loanId = LoanID.uniqueId();
const requestedOn = Date.date();

class Loans {

	static async requestLoan(req, res) {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;

		const {
			firstname,
			lastname,
			email,
			id
		} = req.userData;
		const { loan } = req.body;
		const loanModel = new Models({
			loan,
			firstname,
			lastname,
			email,
			id,
			requestedOn,
			loanId
		});
		if (! await loanModel.requestloan()) {
			return res.status(409).json({
				status: 409,
				message: 'You cant request loan twice. You already have a loan request.',
			});
		}
		return res.status(200).json({
			message: 'Loan request successful',
			data: loanModel.result,
		});
    }

}

export default Loans;