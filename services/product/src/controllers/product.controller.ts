import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '../models/product.model';
import { RedisClientType, createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis: RedisClientType = createClient({ url: redisUrl });
redis.connect().catch((e) => console.warn('Redis not available', e));

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const perPage = parseInt((req.query.perPage as string) || '10');
    const q = req.query.q as string | undefined;

    const cacheKey = `products:${page}:${perPage}:${q || ''}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const filter: any = {};
    if (q) filter.$text = { $search: q };

    const total = await ProductModel.countDocuments(filter);
    const items = await ProductModel.find(filter).skip((page - 1) * perPage).limit(perPage).lean();
    const payload = { items, total };
    await redis.setEx(cacheKey, 60, JSON.stringify(payload));
    res.json(payload);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const cacheKey = `product:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const product = await ProductModel.findById(id).lean();
    if (!product) return res.status(404).json({ message: 'Not found' });
    await redis.setEx(cacheKey, 60 * 5, JSON.stringify(product));
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const p = await ProductModel.create(req.body);
    // invalidate list caches
    await redis.flushAll();
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const p = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    await redis.flushAll();
    res.json(p);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const p = await ProductModel.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await redis.flushAll();
    res.json({ message: 'deleted' });
  } catch (err) {
    next(err);
  }
};