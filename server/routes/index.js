import users from './users';
const appPrefix = '/api/v1';

const routes = (app) =>{
    app.use(appPrefix, users);
}

export default routes;