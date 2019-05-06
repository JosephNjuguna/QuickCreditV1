import users from './users';
import loans from './loans';
import payments from './payments';

const appPrefix = '/api/v1';

const routes = (app) => {
	app.use(appPrefix, users);
	app.use(appPrefix, loans);
	app.use(appPrefix, payments);
};

export default routes;
