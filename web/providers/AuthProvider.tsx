import {
  useMemo,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import * as api from '../api';

type LoginData = { username: string; password: string };
type AuthData = {
  isLoggedIn: boolean;
  username: string | null;
  apiKey: string | null;
  error: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthData>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(null);

  // TODO: Use common User type
  const [user, setUser] = useState<string | null>(null);
  const isLoggedIn = useMemo(() => !!user, [user]);

  const login = useCallback(
    async ({ username, password }: LoginData) => {
      setError('');
      setLoading(true);
      const result = await api.login({ username, password });
      if (!result) {
        setError('Wrong username or password');
      } else {
        setApiKey(result.apiKey);
        setUser(result.username);
      }
      setLoading(false);
    },
    [setError, setLoading, setUser]
  );
  const logout = useCallback(async () => {
    setLoading(true);
    setUser(null);
    setError('');
    setLoading(false);
  }, [setError, setLoading, setUser]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        username: user,
        isLoggedIn,
        isLoading,
        error,
        apiKey,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthData => {
  return useContext(AuthContext);
};
