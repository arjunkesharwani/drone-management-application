import SafeJSONStringify from 'safe-json-stringify';
import UsersModel from '../models/users.model';
import HttpErrors from '../common/errors';
import { STATUS, ServiceOptions, ServiceOptionsDefaults } from '../common/constant';
import logger from '../common/logger';
import { cleanObject, comparePassword, hashPassword } from '../common/helper';
import SecretsHelper from '../common/secrets';

class UsersService {
  Model = UsersModel;
  async getCount(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Users] get count`);
      return this.Model.find(options?.query).countDocuments();
    } catch (err) {
      logger.error(`[Service-Users] get count failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async all(options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Users] find all`);
      const { sort, skip, limit, query, projection, search } = options || {};
      const dbQuery = { ...search, ...query };
      const result = await this.Model.find(dbQuery, { ...projection })
        .skip(skip)
        .limit(limit)
        .sort(sort);
      const total = await this.getCount({ query: dbQuery });
      if (result && result.length > 0) {
        return { skip, limit, total, data: cleanObject(result) };
      }
      throw HttpErrors.NotFound('Users not found');
    } catch (err) {
      logger.error(`[Service-Users] find all failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async get(unique_id: string, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Users] get by unique_id ${unique_id}`);
      const result = await this.Model.findOne({ unique_id, ...options?.query }, { ...options?.projection });
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Users] get by unique_id failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      logger.debug(`[Service-Users] login: ${email}`);
      const user = await this.Model.findOne({ email, status: STATUS.ACTIVE });

      if (!user) {
        throw HttpErrors.NotFound('User not found');
      }
      if (!comparePassword(password, user.password)) {
        throw HttpErrors.Unauthorized('Invalid password');
      }
      const { unique_id: user_id, status } = user;
      const payload = {
        email,
        user_id,
        status,
      };
      const token = SecretsHelper.generate(payload);
      const result = { ...payload, token };
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Users] login failed: ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async create(user: Record<string, unknown>): Promise<any> {
    try {
      logger.debug('[Service-Users] create');
      const data: Record<string, any> = { ...user };
      const { email } = data;
      const existingUser = await this.Model.findOne({ email });
      if (existingUser) {
        throw HttpErrors.BadRequest('User with email  already exists');
      }
      data.password = hashPassword(String(data.password));

      if (!data.last_name) {
        data.last_name = data.first_name;
      }

      const result: any = await this.Model.create(data);
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Users] create failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async patch(unique_id: string, payload: Record<string, unknown>, options: ServiceOptions = ServiceOptionsDefaults): Promise<any> {
    try {
      logger.debug(`[Service-Users] patch ${unique_id}`);
      const condition = { unique_id, ...options?.query };
      let user = await this.get(unique_id);
      const data = { ...payload };
      if (!user) {
        throw HttpErrors.NotFound('User not found');
      }

      if (data.password) {
        data.password = hashPassword(String(data.password));
      }
      const update = { $set: data };
      await this.Model.updateOne(condition, update, { upsert: options?.upsert });
      user = await this.get(unique_id);

      if (user.password) {
        delete user.password;
      }
      return user;
    } catch (err) {
      logger.error(`[Service-Users] patch failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }

  async delete(unique_id: string): Promise<any> {
    try {
      logger.debug(`[Service-Users] delete ${unique_id}`);
      const user = await this.get(unique_id);
      if (!user) {
        throw HttpErrors.NotFound('User not found');
      }
      const result: any = await this.patch(unique_id, { status: STATUS.INACTIVE });
      return cleanObject(result);
    } catch (err) {
      logger.error(`[Service-Users] delete failed ${SafeJSONStringify(err)}`);
      throw err;
    }
  }
}

export default new UsersService() as UsersService;
