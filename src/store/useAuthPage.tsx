import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import type { ReactNode } from 'react';

interface authIf{
    children?: ReactNode;
}

const AuthGuard = ({ children }: authIf) => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn === 0) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default AuthGuard;