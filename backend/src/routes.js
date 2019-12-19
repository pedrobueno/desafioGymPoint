import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json('Hello GymPoint'));

export default routes;
