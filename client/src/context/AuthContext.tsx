import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authApi } from '../api/resources';
import { tokenStorage } from '../api/client';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const USER_KEY = 'ete_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    tokenStorage.get() ? readStoredUser() : null
  );

  const persist = useCallback((token: string, nextUser: AuthUser) => {
    tokenStorage.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await authApi.login(username, password);
      persist(res.token, res.user);
    },
    [persist]
  );

  const register = useCallback(
    async (username: string, password: string) => {
      const res = await authApi.register(username, password);
      persist(res.token, res.user);
    },
    [persist]
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
