import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../providers/AuthProvider';
import { PageWrapper } from '../components/PageWrapper.styles';
import { Header } from '../containers/Header';
import { Login } from '../components/Login';

export default function LoginPage() {
  const { isLoggedIn, login, error } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [router, isLoggedIn]);

  return (
    <>
      <Head>
        <title>PDF Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageWrapper>
        <Header />
        <Login onSubmit={login} error={error} />
      </PageWrapper>
    </>
  );
}
