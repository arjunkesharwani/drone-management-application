import express from 'express';
import { controllerWrapper } from '../../middlewares/response.handler';
import sitesController from './sites.controller';

const SitesRouter = express.Router();

SitesRouter.get('/:id', controllerWrapper(sitesController.get.bind(sitesController)));
SitesRouter.get('/', controllerWrapper(sitesController.find.bind(sitesController)));

SitesRouter.post('/', controllerWrapper(sitesController.create.bind(sitesController)));

SitesRouter.patch('/:id', controllerWrapper(sitesController.patch.bind(sitesController)));

SitesRouter.delete('/:id', controllerWrapper(sitesController.delete.bind(sitesController)));

export default SitesRouter;
