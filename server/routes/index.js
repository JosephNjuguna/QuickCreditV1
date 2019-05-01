import users from './users';
import loans from './loans';
const appPrefix = '/api/v1';

const routes = (app) =>{
    app.use(appPrefix, users);
    app.use(appPrefix, loans);
}

export default routes;