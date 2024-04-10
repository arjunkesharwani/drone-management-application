import { HttpStatus, ResponseSchema, ServiceOptions } from '../../common/constant';
import HttpErrors from '../../common/errors';
import { validateRequest } from '../../common/helper';
import logger from '../../common/logger';
import { serviceOptions } from '../../common/utility';
import { IRequest } from '../../interfaces/express.interface';
import { errorFormatter } from '../../middlewares/error.handler';
import { responseFormatter } from '../../middlewares/response.handler';
import sitesServices from '../../services/sites.services';
import { siteSchema, updateSiteSchema } from '../../validator/sites.validator';

class SitesController {
  async find(req: IRequest): Promise<ResponseSchema> {
    try {
      const { user_id } = req.user;
      const options: ServiceOptions = serviceOptions(req);
      options.query = { ...options.query, user_id };
      options.populate = true;
      logger.info(options);
      const { skip, limit, total, data } = await sitesServices.all(options);
      return responseFormatter(HttpStatus.OK, data, skip, limit, total);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async get(req: IRequest): Promise<any> {
    try {
      const query = req?.query;
      const id = req?.params?.id;
      const result = await sitesServices.get(id, { query });
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
      const payload = validateRequest(siteSchema, body);
      const result = await sitesServices.create({ ...payload, user_id });
      return responseFormatter(HttpStatus.CREATED, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async patch(req: IRequest): Promise<any> {
    try {
      const { body } = req;
      const id = req?.params?.id;
      const payload = validateRequest(updateSiteSchema, body);
      const result = await sitesServices.patch(id, payload);
      return responseFormatter(HttpStatus.OK, result);
    } catch (err) {
      throw errorFormatter(err);
    }
  }

  async delete(req: IRequest): Promise<any> {
    try {
      const id = req?.params?.id;
      const result = await sitesServices.delete(id);
      if (!result) {
        return HttpErrors.NotFound('Record not found');
      }
      return responseFormatter(HttpStatus.OK, { message: 'Site Deleted Successfully' });
    } catch (err) {
      throw errorFormatter(err);
    }
  }
}

export default new SitesController() as SitesController;
