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
  // TODO: Get tailwind theming to work :(
  const style = { backgroundColor: '#ece7e2' };
  return (
    <>
      <div className="flex flex-col min-h-screen justify-between" style={style}>
        <Meta {...social} />
        <Header />
        <div className="leading-normal tracking-normal gradient w-full max-w-7xl mx-auto px-8 py-20 mb-auto">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};
