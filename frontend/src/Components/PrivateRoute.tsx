import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/Login" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute; 