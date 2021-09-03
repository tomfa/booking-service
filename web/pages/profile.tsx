import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { Layout } from '../components/Layout';
import { useMeQuery } from '../graphql/generated/types';

export default function LoginPage() {
  const [session, loading] = useSession();
  const { data } = useMeQuery();
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
      <h3>Session (next-auth)</h3>
      <>{session && JSON.stringify(session)}</>
      <h3>GraphQL Me</h3>
      <>{data && JSON.stringify(data)}</>
    </Layout>
  );
}
