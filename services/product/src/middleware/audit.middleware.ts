import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const audit = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    logger.info('Audit', { method: req.method, path: req.path, user: req.user?.sub || null, role: req.user?.role || null });
  }
  next();
};