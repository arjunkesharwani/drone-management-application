import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectToDatabase } from './config/database.connection';
import environments from './common/env';
import logger from './common/logger';
import authHandler from './middlewares/auth.handler';
import { registerRoutes } from './routes/routes.register';
import { excludedPaths } from './routes/routes.data';

export const startServer = () => {
  const app = express();
  const { PORT } = environments;

  app.use(helmet());
  app.use(cors());
  app.use(json());

  app.use(authHandler.validate(excludedPaths));
  registerRoutes(app);
  app.listen(PORT, () => {
    logger.info(`Server has started on PORT : ${PORT}`);
    logger.info(`[SERVER]: Server is running at http://localhost:${PORT}`);
    connectToDatabase();
  });
};
