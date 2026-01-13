import mongoose from 'mongoose';
import logger from '../utils/logger';
import { ProductModel } from '../models/product.model';

export async function connectDB(uri: string) {
  await mongoose.connect(uri);
  logger.info('Connected to MongoDB');

  try {
    await ProductModel.createIndexes();
    logger.info('Product indexes ensured');
  } catch (err) {
    logger.warn('Failed to ensure product indexes', err);
  }
}
