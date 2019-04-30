import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.should();
chai.use(chaiHttp);


describe('/AUTHENTICATION',()=>{
    describe('/POST signup', () => {

		it('should check user has firstname field and value', (done) => {
			chai.request(app)
				.post('/api/v1/signup')
				.send({
					firstname: '',
					lastname: 'testlastname',
					email: 'test1@mail.com',
					address: 'nairobi',
					password: 'qwerQ@qwerre123'
				})
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
        });
        
		it('should check user has lastname field and value', (done) => {
			chai.request(app)
				.post('/api/v1/signup')
				.send({
					firstname: 'testfirstname',
					lastname: '',
					address: 'nairobi',
					email: 'test1@mail.com',
					password: 'qwerQ@qwerre123'
				})
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
		});

		it('should check user has address field and value', (done) => {
			chai.request(app)
				.post('/api/v1/signup')
				.send({
					firstname: 'testfirstname',
					lastname: 'testlastname',
					address: '',
					email: 'test1@mail.com',
					password: 'qwerQ@qwerre123'
				})
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
        });
        
		it('should check user has email field and value', (done) => {
			chai.request(app)
				.post('/api/v1/signup')
				.send({
					firstname: 'testfirstname',
					lastname: 'testlastname',
					address: 'nairobi',
					email: '',
					password: 'qwerQ@qwerre123'
				})
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
        });
        
		it('should check user has password field and value', (done) => {
			chai.request(app)
				.post('/api/v1/signup')
				.send({
					firstname: 'testfirstname',
					lastname: 'testlastname',
					address: 'nairobi',
					email: 'test1@mail.com',
					password: ''
				})
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
        });
        
		it('should successfully sign up user', (done) => {
			chai.request(app)
				.post('/api/v1/signup')
				.send({
					firstname: 'testfirstname',
					lastname: 'testlastname',
					address: 'nairobi',
					email: 'test1@mail.com',
					password: 'qwerQ@qwerre123'
				})
				.end((err, res) => {
					res.should.have.status(201);
					if (err) return done();
					done();
				});
        });
        
		it('should check user already exist', (done) => {
			chai.request(app)
				.post('/api/v1/signup')
				.send({
					firstname: 'Joseph',
					lastname: 'Njuguna',
					address: 'Kenya',
					email: 'josephnjuguna482@gmail.com',
					password: 'qwerQ@qwerre123'
				})
				.end((err, res) => {
					res.should.have.status(409);
					if (err) return done();
					done();
				});
        });
	});
});