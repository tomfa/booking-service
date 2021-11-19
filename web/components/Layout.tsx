import { ReactNode } from 'react';
import Header from '../containers/Header';
import Footer from '../containers/Footer';
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
      <div className="flex flex-col min-h-screen justify-between">
        <Meta {...social} />
        <Header />
        <div className="leading-normal tracking-normal gradient w-full max-w-7xl mx-auto px-8 py-8 mb-auto">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};
