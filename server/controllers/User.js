import Usermodel from '../models/Users';
import Token from '../helpers/Jwt';
import EncryptData from '../helpers/Encrypt';
import userDate from '../helpers/Date';
import Userid from '../helpers/Uid';

const status = 'unverified';
const isAdmin = false;
const signedupDate = userDate.date();
const userId = Userid.uniqueId();

class Authentication {

	static async registerUser(req, res) {
		try {
			const {
				firstname,
				lastname,
				address,
				email,
				password,
			} = req.body;
			const hashedPassword = EncryptData.generateHash(password);

			const addUser = new Usermodel({
				userId,
				email,
				firstname,
				lastname,
				hashedPassword,
				address,
				status,
				isAdmin,
				signedupDate,
			});			
			if (!await addUser.registerUser()) {
				return res.status(409).json({
					status: 409,
					message: 'email already in use',
				});
			}
			const token = Token.generateToken({
				email,
				id: addUser.result.user_id,
				firstname,
				lastname,
				address,
			});
			return res.status(201).json({
				status: 201,
				token,
				data: addUser.result,
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				message: 'internal server error',
			});
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
				if (EncryptData.validPassword(password, addUser.result.password)) {
					const token = Token.generateToken({
						email: addUser.result.email,
						id: addUser.result.userid,
						firstname: addUser.result.firstname,
						lastname: addUser.result.lastname,
						address: addUser.result.address,
					});
					return res.status(200).json({
						status: 200,
						message: `welcome ${addUser.result.firstname}`,
						data: {
							token,
							id: addUser.result.userid,
							firstname: addUser.result.firstname,
							lastname: addUser.result.lastname,
							email: addUser.result.email,
						},
					});
				}
				return res.status(400).json({
					status: 400,
					message: 'Incorrect password',
				});
			}
			return res.status(404).json({
				message: 'email not found. Sign up to create account',
			});
		} catch (error) {
			return res.status.json({
				status: 500,
				message: 'Internal server error',
			});
		}
	}

};

export default Authentication;