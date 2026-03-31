import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, DEMO_EMAIL, DEMO_PASSWORD } from '@/utils/constants';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';

const DEMO_USER: AuthUser = {
  id: '1',
  name: 'Adewale Ogundimu',
  email: DEMO_EMAIL,
  role: 'Admin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (USE_DEMO) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          const demoToken = 'demo_token_fanndrop_admin';
          localStorage.setItem(AUTH_TOKEN_KEY, demoToken);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_USER));
          setToken(demoToken);
          setUser(DEMO_USER);
        } else {
          throw new Error('Invalid credentials. Use admin@fanndrop.com / admin123');
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Invalid credentials');
        const data = (await response.json()) as { data: { token: string; user: AuthUser } };
        localStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
        setToken(data.data.token);
        setUser(data.data.user);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
