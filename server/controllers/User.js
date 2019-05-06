import jwt from 'jsonwebtoken';
import Usermodel from '../models/Users';
import EncryptData from '../helpers/Encrypt';
import userDate from '../helpers/Date';
import Userid from '../helpers/Uid';
import reqResponses from '../helpers/Responses';
import Token from '../helpers/Token';

const status = 'unverified';
const isAdmin = false;
const signedupDate = userDate.date();
const id = Userid.uniqueId();

class Authentication {
	
	static async registerUser(req, res) {
		try {
			const {
				firstname,
				lastname,
				address,
				email,
				password
			} = req.body;
			const hashedPassword = EncryptData.generateHash(password);
			const addUser = new Usermodel({
				id,
				email,
				firstname,
				lastname,
				password: hashedPassword,
				address,
				status,
				isAdmin,
				signedupDate,
			});
			if (!await addUser.registerUser()) {
				reqResponses.handleError(409, 'Email already in use', res);
			}
			const token = Token.genToken(email,id, firstname, lastname, address);
			reqResponses.handleSignupsuccess(201, 'successfully created account', token, addUser.result, res);
		} catch (error) {			
			// reqResponses.internalError(res);
		}
	}

	static async loginUser(req, res) {
		try {
			const {
				email,
				password,
			} = req.body;
			const addUser = new Usermodel(email);
			if (addUser.loginUser()) {

				const email = addUser.result.email;
				const id = addUser.result.userid;
				const firstname= addUser.result.firstname;
				const lastname = addUser.result.lastname;
				const address= addUser.result.address;

				if (EncryptData.validPassword(password, addUser.result.password)) {
					const token = Token.genToken(email,id, firstname, lastname, address);
					reqResponses.handleSignupsuccess(200, `welcome ${addUser.result.firstname}`,token, addUser.result, res);
				}

				reqResponses.handleError(401, 'Incorrect password', res);

			}
		} catch (error) {
			// reqResponses.handleError(404, 'email not found. Sign up to create account', res);
		}
	}

	static async userProfile(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const userProfileid = req.userData.id;
			const userInfo = new Usermodel(userProfileid);
			if (!await userInfo.userProfile()) {
				reqResponses.handleError(404, 'User id not found', res);
			}
			reqResponses.handleSuccess(200, `welcome ${userInfo.result.firstname}`, userInfo.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}


	static async allUsers(req, res) {
		try {
			const allUserdata = new Usermodel();
			if (!await allUserdata.allUsers()) {
				reqResponses.handleError(404, 'No Users record found', res);
			}
			reqResponses.handleSuccess(200, `All users record`, allUserdata.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}


	static async verifyUser(req, res) {
		try {
			const {
				email
			} = req.params;
			const {
				status
			} = req.body;
			const userVerifaction = new Usermodel({
				email,
				status
			});
			if (!await userVerifaction.verifyUser()) {
				reqResponses.handleError(404, 'User email not found', res);
			}
			reqResponses.handleSuccess(200, 'user verified successfully', userVerifaction.result, res);
		} catch (error) {
			// reqResponses.internalError(res);
		}
	}
}

export default Authentication;