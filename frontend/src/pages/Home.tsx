import React from 'react';

export default function Home() {
  return (
    <div className="container mt-4">
      <h1>Welcome to Ecom Demo</h1>
      <p>This is a minimal home page. Use API to fetch products in real implementation.</p>
      <div className="mt-3">
        <a className="btn btn-outline-primary me-2" href="/products">Browse Products</a>
        <a className="btn btn-outline-secondary" href="/cart">View Cart</a>
      </div>
    </div>
  );
}
