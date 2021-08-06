import { useEffect } from 'react';
import { useRouter } from 'next/router';
import auth from 'next-auth/client';

export default function LoginPage() {
  const [session, loading] = auth.useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (session) {
      router.push('/profile');
    } else {
      auth.signIn();
    }
  }, [router, session, loading]);

  return <div />;
}
