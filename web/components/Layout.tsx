import { ReactNode } from 'react';
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
      <div className="leading-normal tracking-normal text-white gradient">
        {children}
      </div>
    </>
  );
};
