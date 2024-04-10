import { HttpStatus, ResponseSchema, ServiceOptions } from '../../common/constant';
import HttpErrors from '../../common/errors';
import { validateRequest } from '../../common/helper';
import logger from '../../common/logger';
import { serviceOptions } from '../../common/utility';
import { IRequest } from '../../interfaces/express.interface';
import { errorFormatter } from '../../middlewares/error.handler';
import { responseFormatter } from '../../middlewares/response.handler';
import missionsServices from '../../services/missions.services';
import { missionSchema, updateMissionSchema } from '../../validator/mission.validator';

class MissionController {
  async find(req: IRequest): Promise<ResponseSchema> {
    try {
      const options: ServiceOptions = serviceOptions(req);
      logger.info(options);
      const { skip, limit, total, data } = await missionsServices.all(options);
      return responseFormatter(HttpStatus.OK, data, skip, limit, total);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async get(req: IRequest): Promise<any> {
    try {
      const query = req?.query;
      const id = req?.params?.id;
      const result = await missionsServices.get(id, { query });
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
      const payload = validateRequest(missionSchema, body);
      const result = await missionsServices.create(payload);
      return responseFormatter(HttpStatus.CREATED, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async patch(req: IRequest): Promise<any> {
    try {
      const { body } = req;
      const id = req?.params?.id;
      const payload = validateRequest(updateMissionSchema, body);
      const result = await missionsServices.patch(id, payload);
      return responseFormatter(HttpStatus.OK, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async delete(req: IRequest): Promise<any> {
    try {
      const id = req?.params?.id;
      const result = await missionsServices.delete(id);
      if (!result) {
        return HttpErrors.NotFound('Record not found');
      }
      return responseFormatter(HttpStatus.OK, { message: 'Mission deleted successfully' });
    } catch (err) {
      throw errorFormatter(err);
    }
  }
}

export default new MissionController() as MissionController;
