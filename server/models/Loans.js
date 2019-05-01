import db from '../db/loans';

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
		}else{
			return false;
		}

    }
    
}
export default LoanModel;
