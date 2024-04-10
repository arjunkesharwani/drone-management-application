import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { PASSWORD_SALT } from './constant';
import HttpErrors from './errors';

export const parseBoolean = (val: string | any): boolean => {
  switch (val) {
    case 'true':
      return true;
    default:
      return false;
  }
};

export const hashPassword = (value: string): string => {
  return bcrypt.hashSync(value, PASSWORD_SALT);
};

export const cleanObject = (obj: Record<string, any>): Record<string, any> => JSON.parse(JSON.stringify(obj));

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const filterObject = (keys: Array<string>, obj: Record<string, any>): Record<string, string> => {
  const temp = {};
  keys.forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined) {
      temp[key] = obj[key];
    }
  });
  return temp;
};

export const validateRequest = (schema: Record<string, any>, body: Record<string, any>): any => {
  const request: Record<string, any> = filterObject(Object.keys(schema), cleanObject(body));
  const { error } = Joi.object(schema).validate(request);
  if (error) {
    const err = HttpErrors.BadRequest();
    err.message = error?.message;
    throw err;
  }
  return request;
};
