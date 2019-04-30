import db from '../db/users';

class Authentication {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async registerUser() {
		const {
			userId, email, firstname, lastname, hashedPassword, address, status, isAdmin, signedupDate,
		} = this.payload;
		const user = {
			userId,
			email,
			firstname,
			lastname,
			password: hashedPassword,
			address,
			status,
			isAdmin,
			signedupDate,
		};
		const obj = db.find(o => o.email === email);
		if (!obj) {
			db.push(user);
			this.result = user;
			return true;
		}
		return false;
	}
}
export default Authentication;