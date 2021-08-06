import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { Layout } from '../components/Layout';

export default function LoginPage() {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session) {
      router.push('/login');
    }
  }, [router, session, loading]);

  return (
    <Layout social={{ title: 'Vailable | Profile' }}>
      <>{session && JSON.stringify(session)}</>
    </Layout>
  );
}
