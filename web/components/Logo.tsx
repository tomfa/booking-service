import Link from 'next/link';
import { LogoIcon, AWrapper, LogoText } from './Logo.styles';

export const Logo = () => {
  return (
    <Link href="/" passHref>
      <AWrapper>
        <LogoIcon />
        <LogoText>DocForest</LogoText>
      </AWrapper>
    </Link>
  );
};
