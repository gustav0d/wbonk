import { Navigate, Outlet } from 'react-router';
import { getToken } from './security';

export default function AuthLayout() {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
