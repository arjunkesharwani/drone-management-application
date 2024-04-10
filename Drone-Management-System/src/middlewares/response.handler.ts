/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpStatus, ResponseSchema } from '../common/constant';
import { parseBoolean } from '../common/helper';
import { IRequest, ExpressResponse, ExpressNextFunction } from '../interfaces/express.interface';

const setSort = (req: IRequest): any => {
  const { sortFields, sortValues }: Record<string, any> = req.query;
  const sort = {};

  if (sortFields && sortValues) {
    const sortFieldArray = sortFields.split(',');
    const sortValueArray = sortValues.split(',');
    for (let index = 0; index < sortFieldArray.length; index += 1) {
      sort[sortFieldArray[index]] = sortValueArray[index];
    }
  }

  delete req?.query.sortFields;
  delete req?.query.sortValues;

  req.sort = sort;
};

const setPagination = (req: IRequest): any => {
  const { skip = 0, limit = 10 } = req.query;
  req.skip = Number(skip) || 0;
  req.limit = Number(limit) || 10;

  delete req?.query?.skip;
  delete req?.query?.limit;
};

const setSearchQuery = (req: IRequest) => {
  const { searchField, searchText }: Record<string, any> = req.query;
  if (searchField && searchText) {
    if (searchField.includes(',')) {
      const searchValue = new RegExp(searchText, 'i');
      const searchFields = searchField.split(',');
      const $or = searchFields.map(field => {
        return { [field]: searchValue };
      });
      req.search = { $or };
    } else {
      req.search = { [`${searchField}`]: new RegExp(searchText, 'i') };
    }
  }
  delete req?.query?.searchField;
  delete req?.query?.searchText;
};

const setProjection = (req: IRequest) => {
  const { projection = '' }: any = req.query;
  const projectionQuery = {};
  if (projection) {
    projection.split(',').forEach(item => {
      if (item.includes(':')) {
        const [key, value] = item.split(':');
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(Number(value))) {
          projectionQuery[key] = Number(value);
        }
      }
    });
  }
  if (Object.keys(projectionQuery).length) {
    req.projection = projectionQuery;
  }
  delete req?.query?.projection;
};

const setPopulate = (req: IRequest) => {
  if (req?.query?.populate === 'true') {
    req.populate = parseBoolean(req?.query?.populate);
  }
  delete req.query.populate;
};

const parseQueryParams = (req: IRequest) => {
  if (req?.query?.populate === 'true') {
    req.populate = parseBoolean(req?.query?.populate);
  }

  setSort(req);
  setPagination(req);
  setSearchQuery(req);
  setProjection(req);
  setPopulate(req);
  return req;
};

export const setUserContext = (key?: string) => {
  return (req: IRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    const { user = {} } = req;
    req.query[key || 'user_id'] = user.unique_id;
    next();
  };
};

export const controllerWrapper = handler => {
  return async (req: IRequest, res: ExpressResponse, next: ExpressNextFunction): Promise<any> => {
    try {
      // eslint-disable-next-line no-param-reassign
      req = parseQueryParams(req);
      const result = await handler(req, res, next);
      if (result && result !== 302) {
        res.status(result?.status || HttpStatus.OK).send(result);
      }
    } catch (err) {
      res.status(err?.status || HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };
};

export const responseFormatter = (
  status?: number,
  data?: Record<string, unknown> | Array<any>,
  page?: number,
  size?: number,
  total?: number,
) => {
  const response: ResponseSchema = {
    data,
    status,
    page,
    size,
    total,
  };
  return response;
};
