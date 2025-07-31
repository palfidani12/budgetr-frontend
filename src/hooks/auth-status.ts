import { useAuth } from './auth';

export const useAuthStatus = () => {
  const { isLoggedIn, isLoading, accessToken, userId } = useAuth();

  return {
    isAuthenticated: isLoggedIn && !!accessToken,
    isLoading,
    hasToken: !!accessToken,
    userId,
    isReady: !isLoading, // App is ready when auth check is complete
  };
};
