import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, getToken, setToken } from "../api/client";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  city: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, city: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken()
      .then((token) => {
        if (!token) return;
        return apiRequest<{ user: AuthUser }>("/auth/me").then((res) => setUser(res.user));
      })
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleAuthResponse(res: { token: string; user: AuthUser }) {
    await setToken(res.token);
    setUser(res.user);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const res = await apiRequest<{ token: string; user: AuthUser }>("/auth/login", {
          method: "POST",
          body: { email, password },
        });
        await handleAuthResponse(res);
      },
      signup: async (name, email, password, city) => {
        const res = await apiRequest<{ token: string; user: AuthUser }>("/auth/signup", {
          method: "POST",
          body: { name, email, password, city },
        });
        await handleAuthResponse(res);
      },
      logout: async () => {
        await setToken(null);
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
