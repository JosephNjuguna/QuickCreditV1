import express from 'express';
import bodyParser from 'body-parser';
import routes from './server/routes';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));
routes(app);

export default app;
