import express from 'express';
import { controllerWrapper } from '../../middlewares/response.handler';
import missionsController from './missions.controller';

const MissionsRouter = express.Router();

MissionsRouter.get('/:id', controllerWrapper(missionsController.get.bind(missionsController)));
MissionsRouter.get('/', controllerWrapper(missionsController.find.bind(missionsController)));

MissionsRouter.post('/', controllerWrapper(missionsController.create.bind(missionsController)));

MissionsRouter.patch('/:id', controllerWrapper(missionsController.patch.bind(missionsController)));

MissionsRouter.delete('/:id', controllerWrapper(missionsController.delete.bind(missionsController)));

export default MissionsRouter;
