import { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Header from '../containers/Header';
import Footer from '../containers/Footer';
import Meta, { SocialTags } from './MetaTags/Meta';
import { getBreadcrumbs } from './utils/navigation.utils';
import Breadcrumbs from './Breadcrumbs';

export const Layout = ({
  children,
  social = {},
  crumbs,
}: {
  children: ReactNode;
  social?: SocialTags;
  crumbs?: boolean;
}) => {
  // TODO: Get tailwind theming to work :(
  const style = { backgroundColor: '#ece7e2' };
  const router = useRouter();
  const breadcrumbs = useMemo(() => {
    if (!crumbs || !router.isReady) {
      return [];
    }
    return getBreadcrumbs(router.asPath);
  }, [router, crumbs]);

  return (
    <>
      <div className="flex flex-col min-h-screen justify-between" style={style}>
        <Meta {...social} />
        <Header />
        <div
          className={classNames(
            'leading-normal tracking-normal gradient w-full max-w-7xl mx-auto px-8 mb-auto',
            {
              'py-20': !crumbs,
              'pb-20 pt-3': crumbs,
            }
          )}>
          {crumbs && <Breadcrumbs links={breadcrumbs} />}
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};
