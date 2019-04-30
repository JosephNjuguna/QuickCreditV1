import express from 'express';
import routes from './server/routes';

const app = express();
routes(app);

export default app;
