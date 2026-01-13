import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number } // snapshot price optional
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  items: { type: [ItemSchema], default: [] }
}, { timestamps: true });

export const CartModel = mongoose.model('Cart', CartSchema);