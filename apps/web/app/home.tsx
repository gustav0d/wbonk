import type { Route } from './+types/home';

import { TypographyH2 } from '~/components/ui/typography/h2';
import { Button } from '~/components/ui/button';
import { Link } from 'react-router';
import { getToken } from './auth/security';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'wbonk' },
    { name: 'description', content: 'wbonk is a simple bank' },
  ];
}

export default function Home() {
  const authToken = getToken();
  return (
    <main className="flex items-center justify-center pt-4 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-screen max-w-[100vw] p-4">
            <TypographyH2>wbonk</TypographyH2>
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              What&apos;s next?
            </p>
            {authToken ? (
              <Link to="/dashboard">
                <Button variant="link">Go to dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Link to="/login">
                  <Button variant="link">Log in</Button>
                </Link>
                <span className="self-center">or</span>
                <Link to="/register">
                  <Button variant="link">Register</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </main>
  );
}
