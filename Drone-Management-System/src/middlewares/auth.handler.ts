import HttpErrors from '../common/errors';
import logger from '../common/logger';
import SecretsHelper from '../common/secrets';
import { IAuth } from '../interfaces/auth.interface';
import { ExpressNextFunction, IRequest, ExpressResponse } from '../interfaces/express.interface';
import { User } from '../models/users.model';

class AuthHandler {
  validate(excludedPaths: IAuth[]) {
    return (req: IRequest, res: ExpressResponse, next: ExpressNextFunction) => {
      try {
        if (excludedPaths.find(ep => ep.method === req.method && ep.path === req.path)) {
          return next();
        }
        const { authorization = '' } = req.headers;
        if (!authorization) {
          logger.error(`[AUTH] Token not found`);
          throw HttpErrors.Unauthorized('Invalid or expired token');
        }
        const token = authorization.split(' ')[1];
        const user: User = SecretsHelper.validate(token);
        if (!user) {
          throw HttpErrors.Unauthorized('Invalid or expired token');
        }
        req.user = user;
        return next();
      } catch (err) {
        logger.debug(err);
        res.status(err?.status || 401).send(err);
        return null;
      }
    };
  }

  generate(payload: Record<string, any>) {
    return {
      access_token: SecretsHelper.generate(payload),
      user: payload,
      refresh_token: this.refreshToken({ email: payload.email }),
    };
  }

  refreshToken(payload: Record<string, any>, exp = '15d') {
    return SecretsHelper.generate(payload, exp);
  }
}

export default new AuthHandler() as AuthHandler;
