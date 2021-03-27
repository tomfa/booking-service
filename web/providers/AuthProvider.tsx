import { createContext, useCallback, useContext } from 'react';

type LoginData = { username: string; password: string };
type AuthData = {
  isLoggedIn: boolean;
  username: string | null;
  error: string | null;
  isLoading: boolean;
};
export type UseAuthData = {
  login: (props: LoginData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  username: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
};
const defaultValues: AuthData = {
  isLoggedIn: false,
  username: null,
  error: null,
  isLoading: false,
};

export const AuthContext = createContext<AuthData>(defaultValues);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={defaultValues}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): UseAuthData => {
  const context = useContext(AuthContext);
  const login = useCallback(
    async ({ username, password }: LoginData) => {
      // TODO: implement verification and storage of token in localstorage
      context.isLoading = true;
      await new Promise(r => setTimeout(r, 2000));

      // eslint-disable-next-line no-console
      console.log(`Logging in with ${username}:${password}`);
      context.username = username;
      context.isLoggedIn = true;
      context.isLoading = false;

      return true;
    },
    [context]
  );
  const logout = useCallback(async () => {
    context.isLoading = true;
    context.username = null;
    context.error = null;
    context.isLoggedIn = false;
    context.isLoading = false;
    return true;
  }, [context]);
  return {
    login,
    logout,
    username: context.username,
    isLoggedIn: context.isLoggedIn,
    isLoading: context.isLoading,
  };
};
