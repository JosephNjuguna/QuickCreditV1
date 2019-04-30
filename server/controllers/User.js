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
			console.log(error);
			return res.status(500).json({
				status: 500,
				message: 'internal server error',
			});
		}
	}
};

export default Authentication;