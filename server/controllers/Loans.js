import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Models from '../models/Loans';
import Date from '../helpers/Date';
import LoanID from '../helpers/Uid';
import reqResponses from '../helpers/Responses';

dotenv.config();
const loanId = LoanID.loanId();
const requestedOn = Date.date();

class Loans {
	static async requestLoan(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;

			const {
				firstname,
				lastname,
				email,
				id,
			} = req.userData;
			const loan = req.body.amount;

			const loanModel = new Models({
				loan,
				firstname,
				lastname,
				email,
				id,
				requestedOn,
				loanId,
			});

			if (!await loanModel.requestloan()) {
				reqResponses.handleError(409, 'You cant request loan twice. You already have a loan request.', res);
			}
			reqResponses.handleSuccess(200, 'Loan request successful', loanModel.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}

	static async payloan(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const { email } = req.userData;
			const userloanId = req.params.loan_id;
			const loanInstallment = req.body.amount;
			const paidOn = requestedOn;
			const loanModel = new Models({
				email,
				loanInstallment,
				paidOn,
				userloanId,
			});

			if (!await loanModel.payloan()) {
				reqResponses.handleError(404, loanModel.result, res);
			}
			reqResponses.handleSuccess(200, 'loan payment successful', loanModel.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}

	static async allLoanapplications(req, res) {
		try {
			const loanData = new Models();
			if (await loanData.allLoanapplications() === null) {
				reqResponses.handleError(404, loanData.result, res);
			}
			return reqResponses.handleSuccess(200, 'Loan Application Records', loanData.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}

	static async oneLoanapplication(req, res) {
		try {
			const userloanId = req.params.loan_id;
			const oneloanData = new Models(userloanId);
			if (!await oneloanData.oneloanapplication()) {
				reqResponses.handleError(404, 'Loan id not found', res);
			}
			reqResponses.handleSuccess(200, 'success', oneloanData.result, res);
		} catch (error) {
		}
	}

	static async acceptloanapplication(req, res) {
		try {
			const userloanId = req.params.loan_id;
			const { status } = req.body;
			const acceptLoan = new Models({
				userloanId,
				status,
			});
			if (!await acceptLoan.acceptloanapplication()) {
				reqResponses.handleError(404, 'Loan id not found', res);
			}
			return reqResponses.handleSuccess(200, 'loan accepted successfully', acceptLoan.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}

	static async loanRepaidstatus(req, res) {
		try {
			const {
				status,
				repaid,
			} = req.query;

			const loanstatus = new Models({
				status,
				repaid,
			});
			if (!await loanstatus.loanRepaidstatus()) {
				reqResponses.handleError(404, 'No loans records found', res);
			}
			return reqResponses.handleSuccess(200, 'loan status', loanstatus.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}

	static async repaymentHistory(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;

			const { email } = req.userData;
			const userloanId = req.params.loan_id;

			const paymentHistory = new Models({
				email,
				userloanId,
			});
			if (!await paymentHistory.loanRepayment()) {
				reqResponses.handleError(404, 'Loan id not found', res);
			}
			reqResponses.handleSuccess(200, 'Loan Repayment Record ', await paymentHistory.result, res);
		} catch (error) {
			// reqResponses.handleError(404, 'Loan id not found', res);
		}
	}
}

export default Loans;
