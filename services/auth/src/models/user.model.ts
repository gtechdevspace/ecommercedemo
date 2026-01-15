import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'customer' | 'seller' | 'admin';
  refreshTokens: { jti: string; createdAt: Date }[];
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'customer' },
  refreshTokens: [{ jti: { type: String }, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

export const UserModel = model<IUser>('User', UserSchema);
