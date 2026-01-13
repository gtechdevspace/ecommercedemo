import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

export async function registerUser(email: string, password: string, role = 'customer') {
  const hashed = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ email, password: hashed, role });
  return { id: user.id, email: user.email, role: user.role };
}

export async function authenticateUser(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const access = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
  const refresh = jwt.sign({ sub: user.id }, process.env.REFRESH_SECRET || 'refresh', { expiresIn: '7d' });
  // TODO: persist refresh tokens with idempotency
  return { access, refresh };
}

export async function refreshAccessToken(refreshToken: string) {
  const payload: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refresh');
  const user = await UserModel.findById(payload.sub);
  if (!user) return null;
  const access = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
  return { access };
}
