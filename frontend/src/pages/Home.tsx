import React from 'react';
import LogoutButton from '../components/LogoutButton';

export default function Home() {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Welcome to Ecom Demo</h1>
        <div>
          <a className="btn btn-outline-primary me-2" href="/products">Browse Products</a>
          <a className="btn btn-outline-secondary me-2" href="/cart">View Cart</a>
          <a className="btn btn-secondary me-2" href="/checkout">Checkout</a>
        </div>
      </div>

      <p className="mt-3">This is a minimal home page. Use API to fetch products in real implementation.</p>
      <div className="mt-2"><LogoutButton /></div>
    </div>
  );
}
