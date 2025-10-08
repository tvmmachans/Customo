import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthUser, getToken, getUser, isAuthenticated, signIn, signOut } from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};1

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setToken(getToken());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await signIn(email, password);
    setUser(res.user);
    setToken(res.token);
  };

  const logout = () => {
    signOut();
    setUser(null);
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, token, loading, login, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


