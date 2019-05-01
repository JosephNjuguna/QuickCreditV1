import express from 'express';
import loans from '../controllers/Loans';
import validation from '../middleware/validations';
import checkAuth from '../middleware/auth';

const route = express.Router();

route.post('/requestloan',
	checkAuth.checkUser,
	validation.validateLoan,
	loans.requestLoan);

route.get('/loans',
	checkAuth.checkAdmin,
	loans.allLoanapplications);

export default route;