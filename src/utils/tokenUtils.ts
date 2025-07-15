// Token utilities for managing access tokens

export const TOKEN_KEY = 'budgetr_access_token';
export const USER_ID_KEY = 'budgetr_user_id';

export const tokenUtils = {
  // Store token in memory (not localStorage for security)
  setToken: (token: string) => {
    // Store in sessionStorage for persistence during browser session
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from memory
  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  // Remove token from memory
  removeToken: () => {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // Store user ID
  setUserId: (userId: string) => {
    sessionStorage.setItem(USER_ID_KEY, userId);
  },

  // Get user ID
  getUserId: (): string | null => {
    return sessionStorage.getItem(USER_ID_KEY);
  },

  // Remove user ID
  removeUserId: () => {
    sessionStorage.removeItem(USER_ID_KEY);
  },

  // Clear all auth data
  clearAuthData: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
  },

  // Check if token is expired (basic check)
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't decode, assume expired
    }
  },

  // Get token expiration time
  getTokenExpiration: (token: string): Date | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  },
}; 