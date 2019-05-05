import db from '../db/loans';
import userId from '../db/users';

class Uid {
	static uniqueId() {
		const user = userId.length + 1;
		return user;
	}

	static loanId() {
		const loanId = db.length + 1;
		return loanId;
	}
}
export default Uid;
