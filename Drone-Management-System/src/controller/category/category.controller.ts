import { HttpStatus, ResponseSchema, ServiceOptions } from '../../common/constant';
import HttpErrors from '../../common/errors';
import { validateRequest } from '../../common/helper';
import logger from '../../common/logger';
import { serviceOptions } from '../../common/utility';
import { IRequest } from '../../interfaces/express.interface';
import { errorFormatter } from '../../middlewares/error.handler';
import { responseFormatter } from '../../middlewares/response.handler';
import categoryServices from '../../services/category.services';
import { categorySchema, updateCategorySchema } from '../../validator/category.validator';

class CategoryController {
  async find(req: IRequest): Promise<ResponseSchema> {
    try {
      const { user_id } = req.user;
      const options: ServiceOptions = serviceOptions(req);
      options.query = { ...options.query, user_id };
      logger.info(options);
      const { skip, limit, total, data } = await categoryServices.all(options);
      return responseFormatter(HttpStatus.OK, data, skip, limit, total);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async get(req: IRequest): Promise<any> {
    try {
      const query = req?.query;
      const id = req?.params?.id;
      const result = await categoryServices.get(id, { query });
      if (!result) {
        return HttpErrors.NotFound('Record not found');
      }
      return responseFormatter(HttpStatus.OK, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async create(req: IRequest): Promise<any> {
    try {
      const { body } = req;
      const { user_id } = req.user;
      const payload = validateRequest(categorySchema, body);
      const result = await categoryServices.create({ ...payload, user_id });
      return responseFormatter(HttpStatus.CREATED, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async patch(req: IRequest): Promise<any> {
    try {
      const { body } = req;
      const id = req?.params?.id;
      const payload = validateRequest(updateCategorySchema, body);
      const result = await categoryServices.patch(id, payload);
      return responseFormatter(HttpStatus.OK, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async delete(req: IRequest): Promise<any> {
    try {
      const id = req?.params?.id;
      const result = await categoryServices.delete(id);
      if (!result) {
        return HttpErrors.NotFound('Record not found');
      }
      return responseFormatter(HttpStatus.OK, { message: 'Category deleted successfully' });
    } catch (err) {
      throw errorFormatter(err);
    }
  }
}

export default new CategoryController() as CategoryController;
