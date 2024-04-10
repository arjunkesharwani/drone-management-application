import { IRequest } from '../interfaces/express.interface';

export const serviceOptions = (req: IRequest) => {
  return {
    skip: req?.skip,
    limit: req?.limit,
    search: req?.search,
    projection: req?.projection,
    sort: req?.sort,
    populate: req?.populate,
    query: req?.query,
    body: req?.body,
  };
};
