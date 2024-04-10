import jwt from 'jsonwebtoken';
import environments from './env';
import logger from './logger';

class Secrets {
  secretKey: string = environments?.SESSION_SECRET;
  sessionExpire = environments?.TOKEN_EXPIRY_TIME;

  generate(payload: Record<string, unknown>, exp: string = this.sessionExpire): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: exp });
  }

  validate(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (err) {
      logger.debug(`[ERROR]Token expired`);
      return false;
    }
  }
}

const SecretsHelper = new Secrets();

export default SecretsHelper;
