import jwt from 'jsonwebtoken';
import Models from '../models/Loans';
import Date from '../helpers/Date';
import LoanID from '../helpers/Uid';
import dotenv from 'dotenv';

dotenv.config();
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
		const loan = req.body.amount;

		const loanModel = new Models({
			loan,
			firstname,
			lastname,
			email,
			id,
			requestedOn,
			loanId
		});
		
		if (!await loanModel.requestloan()) {
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

	static async payloan(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;

			const {
				email,
				id
			} = req.userData;

			const loanId = req.params.loan_id;
			const loanInstallment = req.body.amount;

			var paidOn = requestedOn;
			const loanModel = new Models({
				loanInstallment,
				paidOn,
				loanId
			});

			if (!await loanModel.payloan()) {
				return res.status(404).json({
					status: 404,
					message: loanModel.result,
				});
			}
			return res.status(200).json({
				status: 200,
				message: 'loan payment successful',
				data: loanModel.result,
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				message: 'internal server error',
			});
		}
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

	static async acceptloanapplication(req, res) {
		const loanId = req.params.loan_id;
		const status = req.body.status;

		const acceptLoan = new Models({
			loanId,
			status,
		});
		if (!await acceptLoan.acceptloanapplication()) {
			return res.status(404).json({
				status: 404,
				message: 'Loan Id not found',
			});
		}
		return res.status(200).json({
			status: 200,
			message: 'loan accepted successfully',
			data: acceptLoan.result,
		});
	}

	static async loanRepaidstatus(req, res) {
		const {
			status,
			repaid,
		} = req.query;

		const loanstatus = new Models({
			status,
			repaid
		});
		if (!await loanstatus.loanRepaidstatus()) {
			return res.status(404).json({
				status: 404,
				message: 'no records found',
			});
		}
		return res.status(200).json({
			status: 200,
			message: 'loan status',
			data: loanstatus.result,
		});
	}

	static async repaymentHistory(req, res){
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;

		const email = req.userData.email;
		const loanId = req.params.loan_id;
		const paymentHistory = new Models({email,loanId});
		if (!await paymentHistory.loanRepayment()) {
			return res.status(404).json({
				status: 404,
				message: 'Loan Id not found',
			});
		}
		return res.status(200).json({
			status: 200,
			data: paymentHistory.result,
		});
	}

}

export default Loans;