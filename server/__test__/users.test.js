import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../app';

const { expect } = chai;
chai.use(chaiHttp);
let userToken, wrongIdToken, adminToken;
const wrongId = 134243;

describe('/USER PROFILE', () => {
	before('generate JWT', (done) => {
		adminToken = jwt.sign({
			email: 'admin123@gmail.com',
			id: 1,
			firstname: 'main',
			lastname: 'admin',
			address: 'database',
		},
		process.env.JWT_KEY, {
			expiresIn: '1h',
		});
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
					res.should.have.status(404);
					if (err) return done();
					done();
				});
		});

		it('should check user ID,EMAIL is available and return user data', (done) => {
			chai.request(app)
				.get('/api/v1/profile')
				.set('authorization', `Bearer ${userToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});
	});

	describe('/PATCH admin verify user', () => {
		it('should check user email is not available', (done) => {
			chai.request(app)
				.patch('/api/v1/user/test2@mail.com/verify')
				.set('authorization', `Bearer ${adminToken}`)
				.send({
					status: 'verified',
				})
				.end((err, res) => {
					expect(res.status).equals(404);
					if (err) return done();
					done();
				});
		});

		it('should check user email is available', (done) => {
			chai.request(app)
				.patch('/api/v1/user/josephnjuguna482@gmail.com/verify')
				.set('authorization', `Bearer ${adminToken}`)
				.send({
					status: 'verified',
				})
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});
	});

	describe('/GET admin and all users data', () => {
		it('admin should get all users', (done) => {
			chai.request(app)
				.get('/api/v1/users')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					expect(res.body.message).equals('All users record');
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});
	});
});
