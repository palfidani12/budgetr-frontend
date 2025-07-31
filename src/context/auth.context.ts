import { createContext } from 'react';

export type AuthContextProps = {
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>(null as unknown as AuthContextProps);
