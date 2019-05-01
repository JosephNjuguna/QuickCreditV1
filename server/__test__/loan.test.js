import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);
let userToken, adminToken;

describe('/LOAN', () => {
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
                email: 'joenjuguna482@gmail.com',
                id: 2,
                firstname: 'Joe',
                lastname: 'Njuguna',
                address: 'Kenya',
            },
            process.env.JWT_KEY, {
                expiresIn: '1h',
            });
        done();
    });

    describe('/POST user request loan', () => {

        it('should check user token available', (done) => {
            chai.request(app)
                .post('/api/v1/requestloan')
                .end((err, res) => {
                    res.should.have.status(400);
                    if (err) return done();
                    done();
                });
        });

        it('should check loan field is entered', (done) => {
            chai.request(app)
                .post('/api/v1/requestloan')
                .send({
                    '': 10000,
                })
                .set('authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    if (err) return done();
                    done();
                });
        });

        it('should check loan amount is entered', (done) => {
            chai.request(app)
                .post('/api/v1/requestloan')
                .send({
                    'loan': "",
                })
                .set('authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    if (err) return done();
                    done();
                });
        });

        it('should check successful loan request', (done) => {
            chai.request(app)
                .post('/api/v1/requestloan')
                .send({
                    loan: 10000,
                })
                .set('authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    if (err) return done();
                    done();
                });
        });

        it('should check user has loan request available', (done) => {
            chai.request(app)
                .post('/api/v1/requestloan')
                .send({
                    loan: 10000,
                })
                .set('authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(409);
                    if (err) return done();
                    done();
                });
        });

    });

    describe('/GET admin', () => {

        it('should check that user is not admin', (done) => {
            chai.request(app)
                .get('/api/v1/loans')
                .set('authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(401);
                    if (err) return done();
                    done();
                });
        });

        it('should get all loan applications', (done) => {
            chai.request(app)
                .get('/api/v1/loans')
                .set('authorization', `Bearer ${adminToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    if (err) return done();
                    done();
                });
        });

    })
});