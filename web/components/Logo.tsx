import Link from 'next/link';
import { SimpleLogoIcon } from './SimpleLogoIcon';

export const Logo = () => {
  return (
    <Link href="/">
      <SimpleLogoIcon />
      <span>Vailable</span>
    </Link>
  );
};
