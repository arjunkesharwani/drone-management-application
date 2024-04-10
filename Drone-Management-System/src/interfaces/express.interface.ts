import { Request, Response, NextFunction } from 'express';
import { User } from '../models/users.model';

export type PAGINATION = {
  limit: number;
  skip: number;
};
export interface IRequest extends Request {
  service?: any;
  limit?: number;
  skip?: number;
  populate?: boolean;
  sort?: Record<string, any>;
  search?: Record<string, any>;
  projection?: Record<string, any>;
  user?: User | Record<string, any>;
  kauth?: Record<string, any>;
}

export type ExpressResponse = Response;
export type ExpressNextFunction = NextFunction;
