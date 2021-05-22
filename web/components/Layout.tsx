import { ReactNode } from 'react';
import { Footer } from '../containers/Footer';
import { Header } from '../containers/Header';
import { ContentWrapper, PageWrapper } from './PageWrapper.styles';
import Meta, { SocialTags } from './MetaTags/Meta';

export const Layout = ({
  children,
  social = {},
}: {
  children: ReactNode;
  social?: SocialTags;
}) => {
  return (
    <>
      <Meta {...social} />
      <PageWrapper>
        <Header />
        <ContentWrapper>{children}</ContentWrapper>
        <Footer />
      </PageWrapper>
    </>
  );
};
