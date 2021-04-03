import {
  useMemo,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';

import * as api from '../api';
import * as storage from '../utils/localStorage';

export type LoginData = { username: string; password: string };
type AuthData = {
  isLoggedIn: boolean;
  username: string | null;
  apiKey: string | null;
  jwtToken: string | null;
  error: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
};
const LOCALSTORAGE_JWT = 'pdf-jwt';
const LOCALSTORAGE_API_KEY = 'pdf-api-key';
const LOCALSTORAGE_USER_KEY = 'pdf-user';

export const AuthContext = createContext<AuthData>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [jwtToken, setJwtToken] = useState<string | null>(
    storage.getItem(LOCALSTORAGE_JWT)
  );
  const [apiKey, setApiKey] = useState<string | null>(
    storage.getItem(LOCALSTORAGE_API_KEY)
  );

  // TODO: Use common User type
  const [user, setUser] = useState<string | null>(
    storage.getItem(LOCALSTORAGE_USER_KEY)
  );
  const isLoggedIn = useMemo(() => !!user, [user]);

  useEffect(() => {
    storage.setItem(LOCALSTORAGE_API_KEY, apiKey);
  }, [apiKey]);

  useEffect(() => {
    storage.setItem(LOCALSTORAGE_USER_KEY, user);
  }, [user]);

  useEffect(() => {
    storage.setItem(LOCALSTORAGE_JWT, jwtToken);
  }, [jwtToken]);

  const login = useCallback(
    async ({ username, password }: LoginData) => {
      if (!username || !password) {
        setError('Fill in username and password');
        return;
      }
      setError('');
      setLoading(true);
      const result = await api.login({ username, password });
      if (result.error) {
        setError(result.message);
      } else {
        setApiKey(result.apiKey);
        setUser(result.username);
        setJwtToken(result.jwt);
      }
      setLoading(false);
    },
    [setError, setLoading, setUser]
  );
  const logout = useCallback(() => {
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
        jwtToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthData => {
  return useContext(AuthContext);
};
