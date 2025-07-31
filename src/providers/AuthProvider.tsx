import { type ReactNode, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { useApi } from '../hooks/api';
import { tokenUtils } from '../utils/tokenUtils';

type AuthStateType = {
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  userId: string | null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const apiClient = useApi();
  const [authState, setAuthState] = useState<AuthStateType>({
    userId: null,
    isLoggedIn: false,
    accessToken: null,
    isLoading: true,
  });
  const [isFetchingInitAuth, setIsFetchinInitAuth] = useState(false);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.authApi.postLogin(email, password);

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { accessToken, userId } = response.data;

      // Store token and user ID
      tokenUtils.setToken(accessToken);
      tokenUtils.setUserId(userId);

      setAuthState({
        userId,
        accessToken,
        isLoading: false,
        isLoggedIn: !!accessToken && !!userId,
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.authApi.postLogout();

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored tokens
      tokenUtils.clearAuthData();

      setAuthState({
        userId: null,
        accessToken: null,
        isLoading: false,
        isLoggedIn: false,
      });
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiClient.authApi.postRefreshToken();

      if (response.ok && response.data) {
        const { accessToken, userId } = response.data;

        // Store new tokens
        tokenUtils.setToken(accessToken);
        tokenUtils.setUserId(userId);

        setAuthState({
          userId,
          accessToken,
          isLoading: false,
          isLoggedIn: !!accessToken && !!userId,
        });
      } else {
        // Refresh failed, clear auth state
        tokenUtils.clearAuthData();
        setAuthState({
          userId: null,
          accessToken: null,
          isLoading: false,
          isLoggedIn: false,
        });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      tokenUtils.clearAuthData();
      setAuthState({
        userId: null,
        accessToken: null,
        isLoading: false,
        isLoggedIn: false,
      });
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to refresh token to check if user is still authenticated
        const response = await apiClient.post<{ accessToken: string; userId: string }, void>('/auth/refresh');

        if (response.ok && response.data) {
          const { accessToken, userId } = response.data;

          // Store tokens
          tokenUtils.setToken(accessToken);
          tokenUtils.setUserId(userId);

          setAuthState({
            userId,
            accessToken,
            isLoading: false,
            isLoggedIn: !!accessToken && !!userId,
          });
        } else {
          // No valid session, user needs to login
          tokenUtils.clearAuthData();
          setAuthState({
            userId: null,
            accessToken: null,
            isLoading: false,
            isLoggedIn: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        tokenUtils.clearAuthData();
        setAuthState({
          userId: null,
          accessToken: null,
          isLoading: false,
          isLoggedIn: false,
        });
      }
    };

    void initializeAuth();
  }, [apiClient]);

  return <AuthContext.Provider value={{ ...authState, login, logout, refreshToken }}>{children}</AuthContext.Provider>;
};
