import SafeJSONStringify from 'safe-json-stringify';
import { HttpStatus, ResponseSchema, ServiceOptions } from '../../common/constant';
import HttpErrors from '../../common/errors';
import logger from '../../common/logger';
import { serviceOptions } from '../../common/utility';
import { IRequest } from '../../interfaces/express.interface';
import { errorFormatter } from '../../middlewares/error.handler';
import { responseFormatter } from '../../middlewares/response.handler';
import usersServices from '../../services/users.services';

class UsersController {
  async find(req: IRequest): Promise<ResponseSchema> {
    try {
      const options: ServiceOptions = serviceOptions(req);
      logger.info(options);
      const { skip, limit, total, data } = await usersServices.all(options);
      return responseFormatter(HttpStatus.OK, data, skip, limit, total);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async get(req: IRequest): Promise<any> {
    try {
      const query = req?.query;
      const id = req?.params?.id;
      const result = await usersServices.get(id, { query });
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
      // const payload = validateRequest(userSchema, body);
      const result = await usersServices.create(body);
      return responseFormatter(HttpStatus.CREATED, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async patch(req: IRequest): Promise<any> {
    try {
      const { body } = req;
      const id = req?.params?.id;
      // const payload = validateRequest(updateUserSchema, body);
      const result = await usersServices.patch(id, body);
      return responseFormatter(HttpStatus.OK, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async delete(req: IRequest): Promise<any> {
    try {
      const id = req?.params?.id;
      const result = await usersServices.delete(id);
      if (!result) {
        return HttpErrors.NotFound('Record not found');
      }
      return responseFormatter(HttpStatus.OK, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async login(req: IRequest): Promise<ResponseSchema> {
    try {
      const { body } = req;
      const { email, password } = body;
      const login = await usersServices.login(email, password);
      return responseFormatter(HttpStatus.OK, login);
    } catch (error) {
      logger.error(`Login  failed ${SafeJSONStringify(error)}`);
      throw error;
    }
  }
}

export default new UsersController() as UsersController;
