import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Layout } from '../components/Layout';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router, isLoggedIn]);

  return (
    <Layout social={{ title: 'Vailable | Home' }}>
      <p>There will likely be things here</p>
    </Layout>
  );
}
