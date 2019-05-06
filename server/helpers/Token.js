import Token from '../helpers/Jwt';
import reqResponses from '../helpers/Responses';

class TokenGen {
	static genToken(email, id, firstname, lastname, address) {
		const tokenDetail = Token.generateToken({
			email,
			id,
			firstname,
			lastname,
			address,
		});
		return tokenDetail;
	}
	static checkToken(token,res) {
		if (!token || token === '') {
			return reqResponses.handleError(400, 'Token required', res);
		}		
		return true;
	}
}
export default TokenGen;
