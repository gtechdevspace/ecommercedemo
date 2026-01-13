import { CartModel } from '../models/cart.model';

export async function getOrCreateCart(userId: string) {
  let cart = await CartModel.findOne({ userId });
  if (!cart) {
    cart = await CartModel.create({ userId, items: [] as any[] });
  }
  return cart;
}

export async function addItem(userId: string, productId: string, quantity: number) {
  const cart = await getOrCreateCart(userId);
  const idx = cart.items.findIndex((i: any) => i.productId === productId);
  if (idx >= 0) {
    cart.items[idx].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  await cart.save();
  return cart;
}

export async function updateQty(userId: string, productId: string, quantity: number) {
  const cart = await getOrCreateCart(userId);
  const idx = cart.items.findIndex((i: any) => i.productId === productId);
  if (idx >= 0) {
    if (quantity <= 0) cart.items.splice(idx, 1);
    else cart.items[idx].quantity = quantity;
    await cart.save();
  }
  return cart;
}

export async function removeItem(userId: string, productId: string) {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i: any) => i.productId !== productId) as any;
  await cart.save();
  return cart;
}

export async function clearCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  cart.items = [] as any;
  await cart.save();
  return cart;
}