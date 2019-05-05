import db from '../db/users';

class Authentication {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async registerUser() {
		const {
			id,
			email,
			firstname,
			lastname,
			hashedPassword,
			address,
			status,
			isAdmin,
			signedupDate,
		} = this.payload;
		const user = {
			id,
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

	async loginUser() {
		const obj = db.find(o => o.email === this.payload);
		if (!obj) {
			this.result = obj;
			return false;
		}
		this.result = obj;
		return true;
	}

	async userProfile() {
		const obj = db.find(o => o.id === parseInt(this.payload) || o.userid === this.payload);
		if (!obj) {
			return false;
		}
		this.result = obj;
		return true;
	}

	async verifyUser() {
		const {
			status,
			email,
		} = this.payload;
		const obj = db.find(o => o.email === email);
		if (!obj) {
			return false;
		}
		const verifiedUser = {
			id: obj.id,
			email: obj.email,
			firstname: obj.firstname,
			lastname: obj.lastname,
			password: obj.password,
			address: obj.address,
			status: status || obj.status,
			isAdmin: obj.isadmin,
			userid: obj.userid,
			signedup_date: obj.signedup_date,
		};
		db.splice(obj.id - 1, 1, verifiedUser);
		this.result = verifiedUser;
		return true;
	}
}
export default Authentication;
