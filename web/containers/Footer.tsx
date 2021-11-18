import Link from 'next/link';
import { config } from '../config';

export const Footer = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li>v. {config.CONFIG_BUILD_ID}</li>
          <li>© {new Date().getFullYear()} Vailable </li>
          <li>
            <Link href={'/privacy'}>Privacy policy</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
