/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SafeJSONStringify } from 'safe-json-stringify';
import { Request, Response, NextFunction } from 'express';
import HttpErrors, { ErrorSchema } from '../common/errors';

export default function errorHandler(err, req: Request, res: Response, next: NextFunction): void {
  const errors = err.errors || [{ message: err.message }];
  res.status(err.status || 500).json({ errors });
}

export const httpErrorHandler = (err): Error | any => {
  let error: any = {};
  if (err.response) {
    error.stack = err?.response?.data;
    error.status = err?.response?.status;
    error.name = 'http_response_error';
    error.message = 'Internal API response resulted in failure';
    return error;
  }
  if (err.request) {
    error = HttpErrors.Unprocessable();
    error.name = 'http_request_error';
    error.message = 'Internal API request resulted in failure';
    return error;
  }
  return null;
};

export const errorFormatter = (err: any): ErrorSchema => {
  let error: ErrorSchema;

  if (err?.status) {
    return err;
  }

  if (err?.code && err?.code === 11000) {
    error = HttpErrors.Conflict();
    error.message = err?.message;
    return error;
  }

  if (err?.code && err?.code === 'LIMIT_UNEXPECTED_FILE') {
    error = HttpErrors.BadRequest('Invalid file key field passed while uploading file');
    return error;
  }

  if (err?.stack?.match(/ValidationError/gi)) {
    error = HttpErrors.PreconditionedFailed('Schema validation failed');
    error.stack = err?.message || err?.stack;
    return error;
  }

  const httpError = httpErrorHandler(err);

  if (httpError) {
    return httpError;
  }
  error = HttpErrors.InternalError();
  error.message = err?.message || '';
  error.stack = err?.stack || SafeJSONStringify(err);
  error.body = err;
  return error;
};
