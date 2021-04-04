import Head from 'next/head';
import { Header } from '../containers/Header';
import { PageWrapper } from './PageWrapper.styles';

export const Layout = ({
  children,
  title = 'DocForest',
}: {
  children: React.ReactChild[] | React.ReactChild;
  title?: string;
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper>
        <Header />
        {children}
      </PageWrapper>
    </>
  );
};
