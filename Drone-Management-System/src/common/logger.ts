import pino from 'pino';

const logger = pino({
  name: 'drone-management',
  level: 'debug',
  nestedKey: 'stack',
});

export default logger;
