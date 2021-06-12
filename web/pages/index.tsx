import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Layout } from '../components/Layout';
import { useFindResourcesQuery } from '../graphql/generated/types';
import { config } from '../config';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { status, data, error, isFetching } = useFindResourcesQuery({
    endpoint: config.GRAPHQL_ENDPOINT,
    fetchParams: {
      headers: {
        'x-api-key': config.GRAPHQL_API_KEY,
      },
    },
  });
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
