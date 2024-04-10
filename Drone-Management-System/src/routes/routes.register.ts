import { Application } from 'express';
import { routes } from './routes.data';
import errorHandler from '../middlewares/error.handler';

export const registerRoutes = (app: Application) => {
  routes.forEach(route => {
    app.use(route.path, route.router);
  });
  app.use(errorHandler);
};
