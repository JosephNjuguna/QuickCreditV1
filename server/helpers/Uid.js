import db from '../db/loans';
class Uid {
	static uniqueId() {
		const userId = `id-${Math.random().toString(36).substr(2, 16)}`;
		return userId;
	}
	static loanId() {
		const loan_Id = db.length + 1;
		return loan_Id;
	}
}
export default Uid;