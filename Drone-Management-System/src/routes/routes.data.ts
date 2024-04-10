import CategoryRouter from '../controller/category/category.router';
import DronesRouter from '../controller/drone/drone.router';
import MissionsRouter from '../controller/missions/missions.router';
import SitesRouter from '../controller/sites/sites.router';
import UsersRouter from '../controller/users/users.router';
import { IAuth } from '../interfaces/auth.interface';
import { Route, Routes } from './routes.type';

export const routes: Routes = [
  new Route('/users', UsersRouter),
  new Route('/sites', SitesRouter),
  new Route('/missions', MissionsRouter),
  new Route('/category', CategoryRouter),
  new Route('/drones', DronesRouter),
];

export const excludedPaths: IAuth[] = [
  { path: '/users/login', method: 'POST' },
  { path: '/users', method: 'POST' },
];
