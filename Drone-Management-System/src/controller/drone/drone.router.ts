import express from 'express';
import { controllerWrapper } from '../../middlewares/response.handler';
import droneController from './drone.controller';

const DronesRouter = express.Router();

DronesRouter.get('/category/:category_id', controllerWrapper(droneController.getDronesByCategory.bind(droneController)));
DronesRouter.get('/:id', controllerWrapper(droneController.get.bind(droneController)));
DronesRouter.get('/', controllerWrapper(droneController.find.bind(droneController)));

DronesRouter.post('/', controllerWrapper(droneController.create.bind(droneController)));

DronesRouter.patch('/:id', controllerWrapper(droneController.patch.bind(droneController)));

DronesRouter.delete('/:id', controllerWrapper(droneController.delete.bind(droneController)));

export default DronesRouter;
