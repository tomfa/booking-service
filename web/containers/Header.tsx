import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/client';
import { LoginMenu } from '../components/Navigation/LoginMenu';
import logo from '../public/logo_small.png';
import { NavLink } from '../components/NavLink';

export const Header = () => {
  const [session] = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <nav className="bg-white dark:bg-gray-800  shadow ">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <div className=" flex items-center">
              <Link href="/">
                <button className="flex flex-row items-center">
                  <div className="h-10 w-10 relative">
                    <Image
                      src={logo}
                      alt="Workflow"
                      layout={'fill'}
                      objectFit={'contain'}
                    />
                  </div>
                  <span className={'text-gray-800 pl-4 text-xl block'}>
                    Vailable
                  </span>
                </button>
              </Link>

              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink href="/">Home</NavLink>
                  <NavLink href="/docs">Docs</NavLink>
                  <NavLink href="/pricing">Pricing</NavLink>
                  <NavLink href="/contact">Contact</NavLink>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <LoginMenu />
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={useCallback(() => setMenuOpen(v => !v), [setMenuOpen])}
                className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="h-8 w-8"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="md:hidden">
          {menuOpen && (
            <div className="px-2 pt-2 pb-3 sm:px-3">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/docs">Docs</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <hr className={'pt-3 mt-3'} />
              {!session && <NavLink href="/login">Login</NavLink>}
              {session && (
                <>
                  <small className={'px-3 text-gray-400'}>
                    {session.user.email}
                  </small>
                  <NavLink href="/profile">Profile</NavLink>
                  <NavLink href="/resources">Resources</NavLink>
                  <NavLink href="/logout">Logout</NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
