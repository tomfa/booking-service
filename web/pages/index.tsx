import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { PageWrapper } from '../components/PageWrapper.styles';
import { Header } from '../containers/Header';
import { PDFEditor } from '../containers/PDFEditor';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
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
        {isLoggedIn && <PDFEditor />}
      </PageWrapper>
    </>
  );
}
