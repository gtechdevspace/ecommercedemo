import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'customer' | 'seller' | 'admin';
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'customer' }
}, { timestamps: true });

export const UserModel = model<IUser>('User', UserSchema);
