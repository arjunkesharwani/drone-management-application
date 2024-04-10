import { HttpStatus, ResponseSchema, ServiceOptions } from '../../common/constant';
import HttpErrors from '../../common/errors';
import { validateRequest } from '../../common/helper';
import logger from '../../common/logger';
import { serviceOptions } from '../../common/utility';
import { IRequest } from '../../interfaces/express.interface';
import { errorFormatter } from '../../middlewares/error.handler';
import { responseFormatter } from '../../middlewares/response.handler';
import dronesServices from '../../services/drones.services';
import { droneSchema, updateDroneSchema } from '../../validator/drone.validator';

class DroneController {
  async find(req: IRequest): Promise<ResponseSchema> {
    try {
      const options: ServiceOptions = serviceOptions(req);
      logger.info(options);
      const { skip, limit, total, data } = await dronesServices.all(options);
      return responseFormatter(HttpStatus.OK, data, skip, limit, total);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async get(req: IRequest): Promise<any> {
    try {
      const query = req?.query;
      const id = req?.params?.id;
      const result = await dronesServices.get(id, { query });
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
      const payload = validateRequest(droneSchema, body);
      const result = await dronesServices.create(payload);
      return responseFormatter(HttpStatus.CREATED, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async patch(req: IRequest): Promise<any> {
    try {
      const { body } = req;
      const id = req?.params?.id;
      const payload = validateRequest(updateDroneSchema, body);
      const result = await dronesServices.patch(id, payload);
      return responseFormatter(HttpStatus.OK, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async delete(req: IRequest): Promise<any> {
    try {
      const id = req?.params?.id;
      const { user_id: deleted_by } = req.user;
      const result = await dronesServices.delete(id, deleted_by);
      if (!result) {
        return HttpErrors.NotFound('Record not found');
      }
      return responseFormatter(HttpStatus.OK, { message: 'Drone deleted successfully' });
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async getDronesByCategory(req: IRequest): Promise<ResponseSchema> {
    try {
      const category_id = req?.params?.category_id;
      const result = await dronesServices.getDronesByCategory(category_id);
      if (!result) {
        throw HttpErrors.NotFound('Drones not found');
      }
      return responseFormatter(HttpStatus.OK, result);
    } catch (error) {
      throw errorFormatter(error);
    }
  }
}

export default new DroneController() as DroneController;
