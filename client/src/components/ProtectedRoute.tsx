import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Guards nested routes, redirecting unauthenticated users to /login. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
