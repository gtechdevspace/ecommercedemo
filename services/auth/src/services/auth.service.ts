import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
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

  // Create refresh token with a JTI and persist it (idempotent)
  const jti = crypto.randomUUID();
  const refresh = jwt.sign({ sub: user.id, jti }, process.env.REFRESH_SECRET || 'refresh', { expiresIn: '7d' });
  user.refreshTokens = user.refreshTokens || [];
  if (!user.refreshTokens.find((r) => r.jti === jti)) {
    user.refreshTokens.push({ jti, createdAt: new Date() } as any);
    await user.save();
  }

  return { access, refresh, role: user.role };
}

export async function refreshAccessToken(refreshToken: string) {
  const payload: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refresh');
  const user = await UserModel.findById(payload.sub);
  if (!user) return null;

  const jti = payload.jti;
  if (!jti) return null;

  // Ensure token exists (idempotency / revocation)
  const found = (user.refreshTokens || []).find((r) => r.jti === jti);
  if (!found) return null;

  // rotate refresh token: remove old jti, add new one
  const newJti = crypto.randomUUID();
  const newRefresh = jwt.sign({ sub: user.id, jti: newJti }, process.env.REFRESH_SECRET || 'refresh', { expiresIn: '7d' });
  user.refreshTokens = (user.refreshTokens || []).filter((r) => r.jti !== jti);
  user.refreshTokens.push({ jti: newJti, createdAt: new Date() } as any);
  await user.save();

  const access = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
  return { access, refresh: newRefresh };
}

export async function revokeRefreshToken(refreshToken: string) {
  try {
    const payload: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refresh');
    const user = await UserModel.findById(payload.sub);
    if (!user) return false;
    const jti = payload.jti;
    if (!jti) return false;
    user.refreshTokens = (user.refreshTokens || []).filter((r) => r.jti !== jti);
    await user.save();
    return true;
  } catch (err) {
    return false;
  }
}
