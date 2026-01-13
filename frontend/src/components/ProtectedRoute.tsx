import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const auth = useSelector((s: RootState) => (s as any).auth);
  if (!auth?.accessToken) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(auth.role)) return <Navigate to="/" replace />;
  return children;
}
