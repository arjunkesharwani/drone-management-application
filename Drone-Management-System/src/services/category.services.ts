import SafeJSONStringify from 'safe-json-stringify';
import HttpErrors from '../common/errors';
import { STATUS, ServiceOptions, ServiceOptionsDefaults } from '../common/constant';
import logger from '../common/logger';
import { cleanObject } from '../common/helper';
import CategoryModel from '../models/category.model';

class CategoryService {
  Model = CategoryModel;

  async getCount(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Category] get count`);
      return this.Model.find(options?.query).countDocuments();
    } catch (err) {
      logger.error(`[Service-Category] get count failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async all(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Category] find all`);
      const { sort, skip, limit, query, projection, search } = options || {};
      const dbQuery = { ...search, ...query, status: STATUS.ACTIVE };
      const result = await this.Model.find(dbQuery, { ...projection })
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.getCount({ query: dbQuery });
      if (result && result.length > 0) {
        return { skip, limit, total, data: cleanObject(result) };
      }
      throw HttpErrors.NotFound('Categories not found');
    } catch (err) {
      logger.error(`[Service-Category] find all failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async get(unique_id: string, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Category] get by unique_id ${unique_id}`);
      const result = await this.Model.findOne({ unique_id, ...options?.query }, { ...options?.projection });
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Category] get by unique_id failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async create(category: Record<string, unknown>): Promise<any> {
    try {
      logger.debug('[Service-Category] create');
      const result: any = await this.Model.create(category);
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Category] create failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async patch(unique_id: string, payload: Record<string, unknown>, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Category] patch ${unique_id}`);
      const condition = { unique_id, ...options?.query };
      let category = await this.get(unique_id);
      const data = { ...payload };
      if (!category) {
        throw HttpErrors.NotFound('Category not found');
      }
      const update = { $set: data };
      await this.Model.updateOne(condition, update, { upsert: options?.upsert });
      category = await this.get(unique_id);
      return cleanObject(category);
    } catch (err) {
      logger.error(`[Service-Category] patch failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async delete(unique_id: string): Promise<any> {
    try {
      logger.debug(`[Service-Category] delete ${unique_id}`);
      const category = await this.get(unique_id);
      if (!category) {
        throw HttpErrors.NotFound('Category not found');
      }
      const result: any = await this.patch(unique_id, { status: STATUS.INACTIVE });
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Category] delete failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }
}

export default new CategoryService() as CategoryService;
