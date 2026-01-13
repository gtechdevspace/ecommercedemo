import React, { useState } from 'react';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      dispatch(setCredentials({ access: res.data.access, refresh: res.data.refresh }));
      alert('Logged in');
    } catch (err: any) {
      alert('Login failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={submit} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
