import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', (req, res) => res.json('Hello GymPoint'));

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

export default routes;
