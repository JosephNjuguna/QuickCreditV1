import express from 'express';
import Validation from '../middleware/validations';
import Users from '../controllers/User';

const route = express.Router();

route.post('/signup', Validation.validatesignup, Users.registerUser);
route.post('/login',  Validation.validatelogin, Users.loginUser);
route.get('/profile', Users.userProfile );

export default route;