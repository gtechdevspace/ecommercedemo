import mongoose from 'mongoose';
import logger from '../utils/logger';
import { CartModel } from '../models/cart.model';

export async function connectDB(uri: string) {
  await mongoose.connect(uri);
  logger.info('Connected to MongoDB for cart service');

  try {
    await CartModel.createIndexes();
    logger.info('Cart indexes ensured');
  } catch (err) {
    logger.warn('Failed to ensure cart indexes', err);
  }
}