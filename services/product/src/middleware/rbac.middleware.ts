import { Request, Response, NextFunction } from 'express';

export const permit = (...allowed: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !allowed.includes(role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};