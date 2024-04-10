import SafeJSONStringify from 'safe-json-stringify';
import HttpErrors from '../common/errors';
import { ServiceOptions, ServiceOptionsDefaults } from '../common/constant';
import logger from '../common/logger';
import { cleanObject } from '../common/helper';
import DroneModel from '../models/drones.model';
import missionsServices from './missions.services';

class DroneService {
  Model = DroneModel;

  async getCount(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Drones] get count`);
      return this.Model.find(options?.query).countDocuments();
    } catch (err) {
      logger.error(`[Service-Drones] get count failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async all(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Drones] find all`);
      const { sort, skip, limit, query, projection, search } = options || {};
      const dbQuery = { ...search, ...query, deleted_on: null };
      const result = await this.Model.find(dbQuery, { ...projection })
        .populate('site', 'site_name position unique_id')
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.getCount({ query: dbQuery });
      if (result && result.length > 0) {
        return { skip, limit, total, data: cleanObject(result) };
      }
      throw HttpErrors.NotFound('Drones not found');
    } catch (err) {
      logger.error(`[Service-Drones] find all failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async get(unique_id: string, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Drones] get by unique_id ${unique_id}`);
      const result = await this.Model.findOne({ unique_id, ...options?.query }, { ...options?.projection }).populate(
        'site',
        'site_name position unique_id',
      );
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Drones] get by unique_id failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async create(drone: Record<string, unknown>): Promise<any> {
    try {
      logger.debug('[Service-Drones] create');
      const result: any = await this.Model.create(drone);
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Drones] create failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async patch(unique_id: string, payload: Record<string, unknown>, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Drones] patch ${unique_id}`);
      const condition = { unique_id, ...options?.query };
      let drone = await this.get(unique_id);
      const data = { ...payload };
      if (!drone) {
        throw HttpErrors.NotFound('Drone not found');
      }
      const update = { $set: data };
      await this.Model.updateOne(condition, update, { upsert: options?.upsert });
      drone = await this.get(unique_id);
      return cleanObject(drone);
    } catch (err) {
      logger.error(`[Service-Drones] patch failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async delete(unique_id: string, deleted_by: string): Promise<any> {
    try {
      logger.debug(`[Service-Drones] delete ${unique_id}`);
      const drone = await this.get(unique_id);
      if (!drone) {
        throw HttpErrors.NotFound('Drone not found');
      }
      const result: any = await this.patch(unique_id, { deleted_by, deleted_on: new Date() });
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Drones] delete failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async getDronesByCategory(category_id: string): Promise<any> {
    try {
      const missions = await missionsServices.getMissionByCategoryId(category_id);
      if (missions?.length > 0) {
        const site_ids = missions.map(mission => mission.site_id);
        const drones = await this.Model.find({ site_id: { $in: site_ids }, deleted_on: null });
        return cleanObject(drones);
      }
      throw HttpErrors.NotFound('No drones in category');
    } catch (error) {
      logger.error(`[Service-Drones] get drones by category failed ${SafeJSONStringify(error)}`);
      throw error;
    }
  }
}

export default new DroneService() as DroneService;
