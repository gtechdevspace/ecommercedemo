import React from 'react';
import { useDispatch } from 'react-redux';
import api from '../api/axios';
import { logout as logoutAction } from '../store/authSlice';

export default function LogoutButton() {
  const dispatch = useDispatch();

  const onLogout = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      try {
        await api.post('/api/auth/logout', { token: refresh });
      } catch (err) {
        // ignore errors
      }
    }
    dispatch(logoutAction());
    window.location.href = '/login';
  };

  return <button className="btn btn-link" onClick={onLogout}>Logout</button>;
}
