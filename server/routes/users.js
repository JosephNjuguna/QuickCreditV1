import express from 'express';
import Validation from '../middleware/validations';
import Auth from '../middleware/auth';
import Users from '../controllers/User';

const route = express.Router();

route.post('/signup', Validation.validatesignup, Users.registerUser);
route.post('/login', Validation.validatelogin, Users.loginUser);
route.get('/profile', Auth.checkUser, Users.userProfile);
route.patch('/user/:email/verify', Auth.checkAdmin, Users.verifyUser);
route.get('/users', Auth.checkAdmin, Users.allUsers);
route.get('/user/:u_id', Auth.checkAdmin, Validation.validateID, Users.oneUser);

export default route;
