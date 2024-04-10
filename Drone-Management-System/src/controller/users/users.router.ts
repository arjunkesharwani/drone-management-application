import express from 'express';
import { controllerWrapper } from '../../middlewares/response.handler';
import usersController from './users.controller';

const UsersRouter = express.Router();

UsersRouter.get('/:id', controllerWrapper(usersController.get.bind(usersController)));
UsersRouter.get('/', controllerWrapper(usersController.find.bind(usersController)));

UsersRouter.post('/', controllerWrapper(usersController.create.bind(usersController)));
UsersRouter.post('/login', controllerWrapper(usersController.login.bind(usersController)));

UsersRouter.patch('/:id', controllerWrapper(usersController.patch.bind(usersController)));

UsersRouter.delete('/:id', controllerWrapper(usersController.delete.bind(usersController)));

export default UsersRouter;
