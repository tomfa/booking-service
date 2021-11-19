import { ReactNode } from 'react';
import Header from '../containers/Header';
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
      <Header />
      <div className="leading-normal tracking-normal text-white gradient">
        {children}
      </div>
    </>
  );
};
