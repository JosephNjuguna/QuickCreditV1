import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../app';

const { expect } = chai;
chai.use(chaiHttp);

let userToken, wrongIdToken;

describe('/USER PROFILE', () => {

	before('generate JWT', (done) => {
		userToken = jwt.sign({
			email: 'josephnjuguna482@gmail.com',
			id: 2,
			firstname: 'Joseph',
			lastname: 'Njuguna',
			address: 'Kenya',
		},
		process.env.JWT_KEY, {
			expiresIn: '1h',
		});
		wrongIdToken = jwt.sign({
			email: 'josephnjuguna482@gmail.com',
			id: 1087,
			firstname: 'Joseph',
			lastname: 'Njuguna',
			address: 'Kenya',
		},
		process.env.JWT_KEY, {
			expiresIn: '1h',
		});
		done();
	});

	describe('/GET user profile data using tokens', () => {

		it('should check user ID,EMAIL is not available', (done) => {
			chai.request(app)
				.get('/api/v1/profile')
				.set('authorization', `Bearer ${wrongIdToken}`)
				.end((err, res) => {
                    expect(res.body.status).equal(404);
					if (err) return done();
					done();
				});
		});

		it('should check user ID,EMAIL is available and return user data', (done) => {
			chai.request(app)
				.get('/api/v1/profile')
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
                    expect(res.body.status).equal(200);
					if (err) return done();
					done();
				});
        });
        
    });

});
