import Link from 'next/link';
import { SimpleLogoIcon } from './SimpleLogoIcon';

export const Logo = () => {
  return (
    <Link href="/">
      <div>
        <SimpleLogoIcon size={'30px'} />
        <span style={{ color: 'white', fontSize: '2rem' }}>DocForest</span>
      </div>
    </Link>
  );
};
