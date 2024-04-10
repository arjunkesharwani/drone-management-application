import SafeJSONStringify from 'safe-json-stringify';
import SitesModel from '../models/sites.model';
import HttpErrors from '../common/errors';
import { STATUS, ServiceOptions, ServiceOptionsDefaults } from '../common/constant';
import logger from '../common/logger';
import { cleanObject } from '../common/helper';

class SiteService {
  Model = SitesModel;

  async getCount(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Sites] get count`);
      return this.Model.find(options?.query).countDocuments();
    } catch (err) {
      logger.error(`[Service-Sites] get count failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async all(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Sites] find all`);
      const { sort, skip, limit, query, projection, search } = options || {};
      const dbQuery = { ...search, ...query, status: STATUS.ACTIVE };
      const result = await this.Model.find(dbQuery, { ...projection })
        .populate('user', 'first_name last_name email unique_id')
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.getCount({ query: dbQuery });
      if (result && result.length > 0) {
        return { skip, limit, total, data: cleanObject(result) };
      }
      throw HttpErrors.NotFound('Sites not found');
    } catch (err) {
      logger.error(`[Service-Sites] find all failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async get(unique_id: string, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Sites] get by unique_id ${unique_id}`);
      const result = await this.Model.findOne({ unique_id, ...options?.query, status: STATUS.ACTIVE }, { ...options?.projection }).populate(
        'user',
        'first_name last_name email unique_id',
      );
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Sites] get by unique_id failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async create(site: Record<string, unknown>): Promise<any> {
    try {
      logger.debug('[Service-Sites] create');
      const result: any = await this.Model.create(site);
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Sites] create failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async patch(unique_id: string, payload: Record<string, unknown>, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Sites] patch ${unique_id}`);
      const condition = { unique_id, ...options?.query };
      let site = await this.get(unique_id);
      const data = { ...payload };
      if (!site) {
        throw HttpErrors.NotFound('Site not found');
      }
      const update = { $set: data };
      await this.Model.updateOne(condition, update, { upsert: options?.upsert });
      site = await this.get(unique_id);
      return cleanObject(site);
    } catch (err) {
      logger.error(`[Service-Sites] patch failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async delete(unique_id: string): Promise<any> {
    try {
      logger.debug(`[Service-Sites] delete ${unique_id}`);
      const site = await this.get(unique_id);
      if (!site) {
        throw HttpErrors.NotFound('Site not found');
      }
      const result: any = await this.patch(unique_id, { status: STATUS.INACTIVE });
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Sites] delete failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }
}

export default new SiteService() as SiteService;
