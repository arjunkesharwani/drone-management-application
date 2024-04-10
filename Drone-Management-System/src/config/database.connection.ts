import mongoose from 'mongoose';
import logger from '../common/logger';
import environments from '../common/env';

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME, DB_PROTOCOL, DB_PORT } = environments;
// Construct MongoDB connection URI
const CONNECTION_URI = [
  `${DB_PROTOCOL}://`,
  DB_USERNAME && DB_PASSWORD ? `${DB_USERNAME}:${DB_PASSWORD}@` : '',
  `${DB_HOST}:${DB_PORT}/`,
  DB_NAME,
].join('');

export const connectToDatabase = async () => {
  try {
    // Connect to MongoDB using the constructed URI
    const conn = await mongoose.connect(CONNECTION_URI);
    logger.info(`Database Connection Successfull: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
};
