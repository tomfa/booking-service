import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/">
      <span style={{ color: 'white', fontSize: '2rem' }}>DocuForest</span>
    </Link>
  );
};
