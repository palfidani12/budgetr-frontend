import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/auth';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isLoggedIn, isLoading, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !accessToken) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, isLoading, accessToken, navigate]);

  if (isLoading) {
    return fallback || <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isLoggedIn || !accessToken) {
    console.log('shows nothing', isLoggedIn, accessToken); // TODO: Fix or remove this condition
    return null; // Will redirect to login
  }

  return <>{children}</>;
}; 