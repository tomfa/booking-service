import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../providers/AuthProvider';
import { Icon, IconType } from '../components/Icon';
import { Layout } from '../components/Layout';

export default function LoginPage() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn) {
      logout();
    }
    router.push('/');
  }, [router, isLoggedIn, logout]);

  return (
    <Layout social={{ title: 'DocForest | Logging out' }}>
      <h1 style={{ paddingTop: '3rem' }}>Logging out...</h1>
      <Icon icon={IconType.LOADING} size={100} />
    </Layout>
  );
}
