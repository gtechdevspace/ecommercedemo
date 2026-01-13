import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  sellerId?: number;
  categories?: string[];
  createdAt?: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  sellerId: { type: Number },
  categories: { type: [String], default: [] }
}, { timestamps: true });

// Text index for search across name, description and categories
ProductSchema.index({ name: 'text', description: 'text', categories: 'text' });

export const ProductModel = model<IProduct>('Product', ProductSchema);
