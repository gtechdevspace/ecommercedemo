import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { registerUser, authenticateUser, refreshAccessToken } from '../services/auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role = 'customer' } = req.body;
    const user = await registerUser(email, password, role);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const tokens = await authenticateUser(email, password);
    if (!tokens) return res.status(401).json({ message: 'Invalid credentials' });
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const newToken = await refreshAccessToken(token);
    if (!newToken) return res.status(401).json({ message: 'Invalid refresh token' });
    res.json(newToken);
  } catch (err) {
    next(err);
  }
};
