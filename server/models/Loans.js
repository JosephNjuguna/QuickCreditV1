import db from '../db/loans';
import payments from '../db/payments';

class LoanModel {

	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async totalAmountdata(amount) {
		const interestRate = 15;
		let numberOfInstallments, installmentAmount, totalamounttoPay, totalAmount;
		totalAmount = ((interestRate / 100) * amount) + amount;
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
			let remainder = totalAmount % numberOfInstallments;
			let remaining = numberOfInstallments - remainder;
			totalamounttoPay = totalAmount + remaining;
		} else {
			totalamounttoPay = totalAmount;
		}
		installmentAmount = totalamounttoPay / numberOfInstallments;
		return {
			numberOfInstallments,
			installmentAmount,
			totalamounttoPay,
			interestRate
		};
	}

	async requestloan() {
		const {
			loan,
			firstname,
			lastname,
			email,
			userId,
			requestedOn,
			loanId,
		} = this.payload;		
		const amount = parseFloat(loan);
		var b = await this.totalAmountdata(amount);
		const obj = await db.find(o => o.user === email);

		if (!obj) {
			const loanInfo = {
				loanId,
				firstname,
				lastname,
				user: email,
				userId,
				tenor: b.numberOfInstallments,
				principalAmount: amount,
				paymentInstallment: b.installmentAmount,
				status: 'pending',
				totalAmounttopay: b.totalamounttoPay,
				balance: 0,
				interestRate: b.interestRate,
				requestedOn,
			};
			db.push(loanInfo);
			this.result = loanInfo;
			return true;
		} else {
			return false;
		}

	}

	async payloan() {

		const {
			loanInstallment,
			paidOn,
			loanId
		} = this.payload;
		const amount = parseFloat(loanInstallment);
		const obj = db.find(o => o.loanId === parseInt(loanId));

		if (obj) {
			const userLoanPayments = payments.filter(o => o.loanId = obj.loanId);
			if (userLoanPayments.length === 0) {
				this.result = 'kindly wait for your application to be accepted'
				return false;
			} else {
				if (userLoanPayments.length === 1) {

					let payment = userLoanPayments[0];
					if (payment.paymentNo == 0) {
						let newPayment = {
							loanId: obj.loanId,
							user: obj.user,
							amount: obj.totalAmounttopay,
							installmentsAmount: payment.paid = amount,
							balance: payment.balance = obj.totalAmounttopay - amount,
							paymentNo: payment.paymentNo = 1,
							paidOn: paidOn
						}
						this.result = newPayment;
						return true;
					} else {
						let newPayment = {
							loanId: obj.loanId,
							user: obj.user,
							amount: obj.totalAmounttopay,
							installmentsAmount: amount,
							balance: payment.balance - amount,
							paymentNo: 2,
							paidOn: paidOn
						}
						payments.push(newPayment);
						this.result = newPayment;
						return true;
					}
				} else {
					const paymentsCount = userLoanPayments.length;
					let latestPayment = userLoanPayments[paymentsCount - 1];
					if (latestPayment.balance === 0) {
						const loanAccept = {
							id: obj.id,
							loanId: obj.loanId,
							user: obj.user,
							requestedOn: obj.requestedOn,
							status: obj.status,
							repaid: true,
							tenor: obj.tenor,
							principalAmount: obj.principalAmount,
							paymentInstallment: obj.paymentInstallment,
							totalAmounttopay: obj.totalAmounttopay,
							balance: obj.totalAmounttopay,
							interestRate: obj.interestRate,
							paidOn: paidOn
						};
						db.splice(obj.id - 1, 1, loanAccept);
						this.result = "Thank for completing your loan payment"
						return true;
					} else {
						let newPayment = {
							loanId: obj.loanId,
							user: obj.user,
							amount: obj.totalAmounttopay,
							installmentsAmount: amount,
							balance: latestPayment.balance - amount,
							paymentNo: paymentsCount + 1,
							paidOn: paidOn
						}
						payments.push(newPayment);
						this.result = newPayment;
						return true;
					}
				}
			}
		} else if (!obj) {
			this.result = "There was an error paying your loan";
			return false;

		}
	}

	async allLoanapplications() {
		if (db.length === 0) {
			this.result = "There are no any loan applications"
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

	async acceptloanapplication() {
		const {
			loanId,
			status
		} = this.payload;
		const obj = db.find(o => o.loanId === parseInt(loanId));
		if (!obj) {
			return false;
		}
		const aPayment = {
			loanId: obj.loanId,
			user: obj.user,
			amount: obj.totalAmounttopay,
			balance: obj.totalAmounttopay,
			paid: 0,
			paymentNo: 0
		}
		payments.push(aPayment)

		const loanAccept = {
			id: obj.id,
			loanId: obj.loanId,
			user: obj.user,
			requestedOn: obj.requestedOn,
			status: status,
			repaid: obj.repaid,
			tenor: obj.tenor,
			principalAmount: obj.principalAmount,
			paymentInstallment: obj.paymentInstallment,
			totalAmounttopay: obj.totalAmounttopay,
			balance: obj.totalAmounttopay,
			interestRate: obj.interestRate,
		};
		db.splice(obj.id - 1, 1, loanAccept);
		this.result = loanAccept;
		return true;
	}

	async loanRepaidstatus() {

		const {
			status,
			repaid
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

	async loanRepayment(){
		const { email,loanId } = this.payload;
		const obj = payments.filter(o => o.user === email && o.loanId === parseInt(loanId));
		if (obj.length === 0) {
			return false;
		}
		this.result = obj;
		return true;
	}
}
export default LoanModel;