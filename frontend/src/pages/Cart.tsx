import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchCart, updateItem, removeItem } from '../store/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => (s as any).cart.items);
  const status = useSelector((s: RootState) => (s as any).cart.status);

  useEffect(() => {
    dispatch<any>(fetchCart());
  }, [dispatch]);

  const onInc = (p: any) => dispatch<any>(updateItem({ productId: p.productId, quantity: p.quantity + 1 }));
  const onDec = (p: any) => dispatch<any>(updateItem({ productId: p.productId, quantity: Math.max(0, p.quantity - 1) }));
  const onRemove = (p: any) => dispatch<any>(removeItem({ productId: p.productId }));

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {status === 'loading' && <div>Loading...</div>}
      <div className="list-group">
        {items.length === 0 && <div className="mt-3">Your cart is empty</div>}
        {items.map((p: any) => (
          <div key={p.productId} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div><strong>{p.productId}</strong></div>
              <div>Qty: {p.quantity}</div>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onDec(p)}>-</button>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onInc(p)}>+</button>
              <button className="btn btn-sm btn-danger" onClick={() => onRemove(p)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}