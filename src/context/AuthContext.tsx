import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi";
import { setToken } from "../api/authStore";
import type { ReactNode } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, otp: string) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persistToken = (token: string | null) => {
    // keep token in-memory only
    setToken(token);
    setAccessToken(token);
  };

  const fetchProfile = async (token: string) => {
    try {
      const profile = await authApi.me(token);
      setUser(profile);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Try refresh token on mount to obtain accessToken via refresh cookie
        const refreshed = await authApi.refreshToken();
        if (refreshed?.accessToken) {
          persistToken(refreshed.accessToken);
          await fetchProfile(refreshed.accessToken);
        }
      } catch (err) {
        // ignore other errors
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, otp });
      if (!data?.accessToken) throw new Error(data?.message || "Login failed");
      persistToken(data.accessToken);
      await fetchProfile(data.accessToken);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    await authApi.sendOtp({ email, purpose: "login" });
  };

  const logout = async () => {
    try {
      await authApi.logout(accessToken || undefined);
    } catch (e) {
      // ignore errors
    }
    persistToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, sendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
