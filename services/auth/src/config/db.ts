import mongoose from 'mongoose';
import logger from '../utils/logger';

export async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error', err);
    throw err;
  }
}
