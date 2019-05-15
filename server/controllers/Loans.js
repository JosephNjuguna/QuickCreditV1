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
			const loan = req.body.amount;
			const loanModel = new Models({
				loan,
				firstname: req.userData.firstname,
				lastname: req.userData.lastname,
				email: req.userData.email,
				id: req.userData.id,
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

	static async userloanStatus(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const userRequestLoanemail = req.userData.email;
			const loanStatus = new Models(userRequestLoanemail);
			if (!await loanStatus.userloanStatus()) {
				reqResponses.handleError(404, loanStatus.result, res);
			}
			reqResponses.handleSuccess(200, "success", loanStatus.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}

	static async payloan(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			
			const loanModel = new Models({
				email: req.userData.email,
				loanInstallment: req.body.amount,
				paidOn: requestedOn,
				userloanId: req.params.loan_id,
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
		} catch (error) {}
	}

	static async acceptloanapplication(req, res) {
		try {
			const userloanId = req.params.loan_id;
			const {
				status
			} = req.body;
			const acceptLoan = new Models({
				userloanId,
				status,
			});
			if (!await acceptLoan.acceptloanapplication()) {
				return reqResponses.handleError(404, 'Loan id not found', res);
			}
			reqResponses.handleSuccess(200, 'loan accepted successfully', acceptLoan.result, res);
		} catch (error) {
			reqResponses.internalError(res);
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

			const {
				email
			} = req.userData;
			const userloanId = req.params.loan_id;

			const paymentHistory = new Models({
				email,
				userloanId,
			});
			if (!await paymentHistory.loanRepayment()) {
				reqResponses.handleError(404, 'Loan id not found', res);
			}
			reqResponses.handleSuccess(200, 'Loan Repayment Record ', paymentHistory.result, res);
		} catch (error) {
			// reqResponses.handleError(404, 'Loan id not found', res);
		}
	}

	static async allLoanpayments(req, res) {
		try {
			const loanData = new Models();
			if (!await loanData.allLoanpayments()) {
				reqResponses.handleError(404, loanData.result, res);
			}
			reqResponses.handleSuccess(200, 'Loan Repayment History Record', loanData.result, res);
		} catch (error) {
			// return reqResponses.handleError(404, 'Loan id not found', res);
		}
	}

}

export default Loans;