import db from '../db/loans';
import payments from '../db/payments';

const interestRate = 15;
class LoanModel {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async totalAmountdata(amount) {
		let numberOfInstallments, installmentAmount, totalamounttoPay;
		const totalAmount = ((interestRate / 100) * amount) + amount;
		if (totalAmount <= 4000) {
			numberOfInstallments = 4;
		} else if (totalAmount > 4000 && totalAmount <= 9000) {
			numberOfInstallments = 6;
		} else if (totalAmount > 9000 && totalAmount <= 12000) {
			numberOfInstallments = 8;
		} else if (totalAmount > 12000 && totalAmount <= 15000) {
			numberOfInstallments = 10;
		} else if (totalAmount > 15000 && totalAmount <= 18000) {
			numberOfInstallments = 12;
		} else if (totalAmount > 18000 && totalAmount <= 20000) {
			numberOfInstallments = 14;
		} else if (totalAmount > 20000 && totalAmount <= 24000) {
			numberOfInstallments = 16;
		}
		if (totalAmount % numberOfInstallments !== 0) {
			const remainder = totalAmount % numberOfInstallments;
			const remaining = numberOfInstallments - remainder;
			totalamounttoPay = totalAmount + remaining;
		} else {
			totalamounttoPay = totalAmount;
		}
		installmentAmount = totalamounttoPay / numberOfInstallments;
		return {
			numberOfInstallments,
			installmentAmount,
			totalamounttoPay,
			interestRate,
		};
	}

	async requestloan() {
		const amount = parseFloat(this.payload.loan);
		const calculateTotalamount = await this.totalAmountdata(amount);
		const obj = await db.find(o => o.user === this.payload.email);
		if (!obj) {
			const loanInfo = {
				loanId: this.payload.loanId,
				firstname: this.payload.firstname,
				lastname: this.payload.lastname,
				user: this.payload.email,
				userId: this.payload.userId,
				tenor: calculateTotalamount.numberOfInstallments,
				principalAmount: amount,
				paymentInstallment: calculateTotalamount.installmentAmount,
				status: 'pending',
				totalAmounttopay: calculateTotalamount.totalamounttoPay,
				balance: 0,
				interestRate: calculateTotalamount.interestRate,
				requestedOn: this.payload.requestedOn,
			};
			db.push(loanInfo);
			this.result = loanInfo;
			return true;
		}
		return false;
	}

	async secondLoanpayment(loanId, user, totalAmounttopay, amount, balance, paidOn) {
		const secondPayment = {
			loanId: loanId,
			user: user,
			amount: totalAmounttopay,
			installmentsAmount: amount,
			balance: balance,
			paymentNo: 2,
			paidOn,
		};
		return secondPayment;
	}

	async continouedLoanpayment(loanId, user, totalAmounttopay, amount, balance, paymentNo, paidOn) {
		const continousPayment = {
			loanId: loanId,
			user: user,
			amount: totalAmounttopay,
			installmentsAmount: amount,
			balance: balance,
			paymentNo: paymentNo,
			paidOn,
		};
		return continousPayment;
	}

	async loanAcceptdetail(loanId, user, requestedOn, status, tenor, principalAmount, paymentInstallment, totalAmounttopay, interestRate,  paidOn) {
		const loanAccept = {
			loanId: loanId,
			user: user,
			requestedOn: requestedOn,
			status: status,
			repaid: true,
			tenor: tenor,
			principalAmount: principalAmount,
			paymentInstallment: paymentInstallment,
			totalAmounttopay: totalAmounttopay,
			balance: totalAmounttopay,
			interestRate: interestRate,
			paidOn,
		};
		return loanAccept;
	}

	async payloan() {
		const amount = parseFloat(this.payload.loanInstallment);
		const obj = db.find(o => o.loanId === parseInt(this.payload.userloanId) && o.user === this.payload.email);
		if (obj) {
			const userLoanPayments = payments.filter(o => o.loanId = obj.loanId);
			const paymentsCount = userLoanPayments.length;
			const latestPayment = userLoanPayments[paymentsCount - 1];
			const balance = latestPayment.balance - amount;
			const paymentNo = paymentsCount + 1;
			if (userLoanPayments.length === 0) {
				this.result = 'kindly wait for your application to be accepted';
				return false;
			}
			if (latestPayment.balance === 0) {
				const loanpaymentDetail = await this.loanAcceptdetail(obj.loanId, obj.user, obj.requestedOn, obj.status, obj.tenor, obj.principalAmount, obj.paymentInstallment, obj.totalAmounttopay, obj.interestRate,this.payload.paidOn);
				db.splice(obj.id - 1, 1, loanpaymentDetail);
				this.result = 'Thank for completing your loan payment';
				return true;
			}
			if (userLoanPayments.length === 1) {
				const payment = userLoanPayments[0];
				if (payment.paymentNo === 0) {
					const newPayment = {
						loanId: obj.loanId,
						user: obj.user,
						amount: obj.totalAmounttopay,
						installmentsAmount: payment.paid = amount,
						balance: payment.balance = obj.totalAmounttopay - amount,
						paymentNo: payment.paymentNo = 1,
						paidOn: this.payload.paidOn,
					};
					this.result = newPayment;
					return true;
				}
				const secondLoanpaymentdetails = await this.secondLoanpayment(obj.loanId, obj.user, obj.totalAmounttopay, amount, balance, this.payload.paidOn);
				payments.push(secondLoanpaymentdetails);
				this.result = secondLoanpaymentdetails;
				return true;
			} else {
				const newPaymentdetails = await this.continouedLoanpayment(obj.loanId, obj.user, obj.totalAmounttopay, amount, balance, paymentNo, this.payload.paidOn);
				payments.push(newPaymentdetails);
				this.result = newPaymentdetails;
				return true;
			}
		}
		this.result = 'There was an error paying your loan';
		return false;
	}

	async allLoanapplications() {
		if (db.length === 0) {
			this.result = 'There are no any loan applications';
			return false;
		}
		this.result = db;
		return true;
	}

	async oneloanapplication() {
		const obj = db.find(o => o.loanId === parseInt(this.payload));
		if (!obj) {
			return false;
		}
		this.result = obj;
		return true;
	}

	async acceptLoan(loanId, user, requestedOn, status, repaid, tenor, principalAmount, paymentInstallment, totalAmounttopay, interestRate) {
		const loanAccept = {
			loanId: loanId,
			user: user,
			requestedOn: requestedOn,
			status: status,
			repaid: repaid,
			tenor: tenor,
			principalAmount: principalAmount,
			paymentInstallment: paymentInstallment,
			totalAmounttopay: totalAmounttopay,
			balance: totalAmounttopay,
			interestRate: interestRate,
		};
		return loanAccept;
	}

	async acceptloanapplication() {
		const status = this.payload.status;
		const obj = db.find(o => o.loanId === parseInt(this.payload.userloanId));
		if (!obj) {
			return false;
		}
		const aPayment = {
			loanId: obj.loanId,
			user: obj.user,
			amount: obj.totalAmounttopay,
			balance: obj.totalAmounttopay,
			paid: 0,
			paymentNo: 0,
		};
		const loanAcceptdetail = await this.acceptLoan(obj.loanId, obj.user, obj.requestedOn, status, obj.repaid, obj.tenor, obj.principalAmount, obj.paymentInstallment, obj.totalAmounttopay, obj.interestRate);
		payments.push(aPayment);
		db.splice(obj.id - 1, 1, loanAcceptdetail);
		this.result = loanAcceptdetail;
		return true;
	}

	async loanRepaidstatus() {
		const {
			status,
			repaid,
		} = this.payload;

		let repaidStatus;

		if (repaid === 'false') {
			repaidStatus = false;
		} else if (repaid === 'true') {
			repaidStatus = true;
		}

		const obj = db.filter(o => o.status === status && o.repaid === repaidStatus);
		if (obj.length === 0) {
			return false;
		}
		this.result = obj;
		return true;
	}

	async loanRepayment() {
		const {
			email,
			userloanId
		} = this.payload;
		const obj = payments.filter(o => o.user === email && o.loanId === parseInt(userloanId));
		if (obj.length === 0) {
			return false;
		}
		this.result = obj;
		return true;
	}
}
export default LoanModel;