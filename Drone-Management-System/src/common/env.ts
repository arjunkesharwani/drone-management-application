import dotenv from 'dotenv';
import { DEFAULT_ENV } from './constant';

dotenv.config();

type EnvironmentSchema = {
  PORT: string | number;
  SESSION_SECRET: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_PROTOCOL: string;
  DB_PORT: string;
  TOKEN_EXPIRY_TIME: string;
};

const EnvironmentDefaults: EnvironmentSchema = {
  PORT: DEFAULT_ENV.PORT,
  SESSION_SECRET: DEFAULT_ENV.SESSION_SECRET,
  DB_HOST: DEFAULT_ENV.DB_HOST,
  DB_NAME: DEFAULT_ENV.DB_NAME,
  DB_USERNAME: DEFAULT_ENV.DB_USERNAME,
  DB_PASSWORD: DEFAULT_ENV.DB_PASSWORD,
  DB_PROTOCOL: DEFAULT_ENV.DB_PROTOCOL,
  DB_PORT: DEFAULT_ENV.DB_PORT,
  TOKEN_EXPIRY_TIME: DEFAULT_ENV.TOKEN_EXPIRY_TIME,
};

const getEnv = (): any => {
  const env = {};
  Object.keys(EnvironmentDefaults).forEach(key => {
    if (process.env[key]) {
      env[key] = process.env[key];
    }
  });
  return env;
};

const environments: EnvironmentSchema = { ...EnvironmentDefaults, ...getEnv() };

const requiredEnv = ['DB_HOST', 'DB_NAME'];

// eslint-disable-next-line consistent-return
requiredEnv.forEach(key => {
  if (!environments[key]) {
    // eslint-disable-next-line no-console
    console.error(`[Error] Missing Environment Config: ${key}`);
    // eslint-disable-next-line no-console
    console.error(`[Error] Please ensure all required envs are injected ${requiredEnv}`);

    return process.exit(1);
  }
});

export default environments;
