import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../providers/AuthProvider';
import { Login } from '../components/Login';
import { Layout } from '../components/Layout';

export default function LoginPage() {
  const { isLoggedIn, login, error } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [router, isLoggedIn]);

  return (
    <Layout social={{ title: 'DocForest | Login' }}>
      <Login onSubmit={login} error={error} />
    </Layout>
  );
}
