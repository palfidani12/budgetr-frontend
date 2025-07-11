import { useState, type ReactNode } from "react";
import { AuthContext } from "../context/auth.context";

type AuthStateType = {
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  userId: string | null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthStateType>({
    userId: null,
    isLoggedIn: false,
    accessToken: null,
    isLoading: false,
  });

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw new Error("Login failed");
    }
    const data: { accessToken: string; userId: string } = await res.json();

    setAuthState({
      userId: data.userId,
      accessToken: data.accessToken,
      isLoading: false,
      isLoggedIn: !!data.accessToken && !!data.userId,
    });
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Logout failed");

    setAuthState({
      userId: null,
      accessToken: null,
      isLoading: false,
      isLoggedIn: false,
    });
  };

  const refreshToken = async () => {
    console.log("heeey");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
