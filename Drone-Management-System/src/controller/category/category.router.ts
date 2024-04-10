import express from 'express';
import { controllerWrapper } from '../../middlewares/response.handler';
import categoryController from './category.controller';

const CategoryRouter = express.Router();

CategoryRouter.get('/:id', controllerWrapper(categoryController.get.bind(categoryController)));
CategoryRouter.get('/', controllerWrapper(categoryController.find.bind(categoryController)));

CategoryRouter.post('/', controllerWrapper(categoryController.create.bind(categoryController)));

CategoryRouter.patch('/:id', controllerWrapper(categoryController.patch.bind(categoryController)));

CategoryRouter.delete('/:id', controllerWrapper(categoryController.delete.bind(categoryController)));

export default CategoryRouter;
