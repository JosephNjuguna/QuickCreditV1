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
	
	static async allLoanapplications(req, res) {
		const loanData = new Models();
		if (!await loanData.allLoanapplications()) {
			return res.status(404).json({
				status: 404,
				message: loanData.result,
			});
		}
		return res.status(200).json({
			status: 200,
			data: loanData.result,
		});
	}

	static async oneLoanapplication(req, res) {
		const loanId = req.params.loan_id;
		const oneloanData = new Models(loanId);

		if (!await oneloanData.oneloanapplication()) {
			return res.status(404).json({
				status: 404,
				message: 'Id not found',
			});
		}
		return res.status(200).json({
			status: 200,
			data: oneloanData.result,
		});
	}

}

export default Loans;