import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';

export async function getCart(req: Request & { user?: any }, res: Response) {
  const userId = req.user?.sub || req.user?.id;
  const cart = await cartService.getOrCreateCart(userId);
  res.json(cart);
}

export async function addCartItem(req: Request & { user?: any }, res: Response) {
  const userId = req.user?.sub || req.user?.id;
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ message: 'productId and quantity required' });
  const cart = await cartService.addItem(userId, productId, Number(quantity));
  res.status(200).json(cart);
}

export async function updateCartItem(req: Request & { user?: any }, res: Response) {
  const userId = req.user?.sub || req.user?.id;
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateQty(userId, productId, Number(quantity));
  res.json(cart);
}

export async function removeCartItem(req: Request & { user?: any }, res: Response) {
  const userId = req.user?.sub || req.user?.id;
  const { productId } = req.params;
  const cart = await cartService.removeItem(userId, productId);
  res.json(cart);
}

export async function clearCart(req: Request & { user?: any }, res: Response) {
  const userId = req.user?.sub || req.user?.id;
  const cart = await cartService.clearCart(userId);
  res.json(cart);
}