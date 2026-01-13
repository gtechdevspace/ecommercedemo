import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { addItem } from '../store/cartSlice';
import { RootState } from '../store';

export default function Products() {
  const dispatch = useDispatch();
  const products = useSelector((s: RootState) => (s as any).products.items);
  const status = useSelector((s: RootState) => (s as any).products.status);
  const total = useSelector((s: RootState) => (s as any).products.total);

  const [page, setPage] = useState(1);
  const perPage = 6;
  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch<any>(fetchProducts({ page, perPage, q: q || undefined }));
  }, [dispatch, page, q]);

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

  return (
    <div className="container mt-4">
      <h2>Products</h2>

      <div className="row mb-3">
        <div className="col-md-8">
          <input className="form-control" placeholder="Search products" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
      </div>

      {status === 'loading' && <div>Loading...</div>}
      {status === 'failed' && <div className="text-danger">Failed to load products</div>}

      <div className="row">
        {products.map((p: any) => (
          <div className="col-md-4" key={p._id}>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <p className="card-text">${p.price}</p>
                <button className="btn btn-primary" onClick={() => dispatch<any>(addItem({ productId: p._id, quantity: 1 }))}>Add to cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>Page {page} of {totalPages}</div>
        <div>
          <button className="btn btn-secondary me-2" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <button className="btn btn-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}
