import SafeJSONStringify from 'safe-json-stringify';
import HttpErrors from '../common/errors';
import { STATUS, ServiceOptions, ServiceOptionsDefaults } from '../common/constant';
import logger from '../common/logger';
import { cleanObject } from '../common/helper';
import MissionModel from '../models/missions.model';

class MissionService {
  Model = MissionModel;

  async getCount(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Missions] get count`);
      return this.Model.find(options?.query).countDocuments();
    } catch (err) {
      logger.error(`[Service-Missions] get count failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async all(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Missions] find all`);
      const { sort, skip, limit, query, projection, search } = options || {};
      const dbQuery = { ...search, ...query, status: STATUS.ACTIVE };
      const result = await this.Model.find(dbQuery, { ...projection })
        .populate('site', 'site_name position unique_id')
        .populate('category', 'name color tag_name unique_id')
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.getCount({ query: dbQuery });
      if (result && result.length > 0) {
        return { skip, limit, total, data: cleanObject(result) };
      }
      throw HttpErrors.NotFound('Missions not found');
    } catch (err) {
      logger.error(`[Service-Missions] find all failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async get(unique_id: string, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Missions] get by unique_id ${unique_id}`);
      const result = await this.Model.findOne({ unique_id, ...options?.query }, { ...options?.projection })
        .populate('site', 'site_name position unique_id')
        .populate('category', 'name color tag_name unique_id');
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Missions] get by unique_id failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async create(mission: Record<string, unknown>): Promise<any> {
    try {
      logger.debug('[Service-Missions] create');
      const result: any = await this.Model.create(mission);
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Missions] create failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async patch(unique_id: string, payload: Record<string, unknown>, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Missions] patch ${unique_id}`);
      const condition = { unique_id, ...options?.query };
      let mission = await this.get(unique_id);
      const data = { ...payload };
      if (!mission) {
        throw HttpErrors.NotFound('Mission not found');
      }
      if (data.site_id && mission.site_id !== data.site_id) {
        throw HttpErrors.BadRequest('Cannot change the site assignment of a mission');
      }
      const update = { $set: data };
      await this.Model.updateOne(condition, update, { upsert: options?.upsert });
      mission = await this.get(unique_id);
      return cleanObject(mission);
    } catch (err) {
      logger.error(`[Service-Missions] patch failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async delete(unique_id: string): Promise<any> {
    try {
      logger.debug(`[Service-Missions] delete ${unique_id}`);
      const mission = await this.get(unique_id);
      if (!mission) {
        throw HttpErrors.NotFound('Mission not found');
      }
      const result: any = await this.patch(unique_id, { status: STATUS.INACTIVE });
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Missions] delete failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async getMissionByCategoryId(category_id: string): Promise<any> {
    try {
      const missions = await this.Model.find({ category_id, status: STATUS.ACTIVE });
      return missions;
    } catch (error) {
      logger.error(`[Service-Missions] get missions by category failed ${SafeJSONStringify(error)}`);
      throw error;
    }
  }
}

export default new MissionService() as MissionService;
