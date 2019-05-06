import db from '../db/users';

class Authentication {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	async registerUser() {
		const user = {
			id: this.payload.id,
			email: this.payload.email,
			firstname : this.payload.firstname,
			lastname: this.payload.lastname,
			password: this.payload.password,
			address :this.payload.address,
			status: this.payload.status,
			isAdmin : this.payload.isAdmin,
			signedupDate : this.payload.signedupDate,
		};
		const obj = db.find(o => o.email === this.payload.email);
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
	
	async allUsers() {
		if (db.length === 0) {
			return false;
		}
		this.result = db;
		return true;
	}
}
export default Authentication;
