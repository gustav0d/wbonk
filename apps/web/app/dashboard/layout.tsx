import { Outlet, Link, Navigate } from 'react-router';
import { getToken, useLogout } from '~/auth/security';
import { Button } from '~/components/ui/button';
import { TypographyH2 } from '~/components/ui/typography/h2';

export default function DashboardLayout() {
  const token = getToken();
  const logout = useLogout();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center pt-4 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9 w-full">
          <div className="w-screen max-w-[100vw] p-4 flex justify-between items-center">
            <TypographyH2>wbonk</TypographyH2>
            <nav className="flex items-center gap-4">
              <Link to="/dashboard" className="hover:underline font-medium">
                Dashboard
              </Link>
              <Link
                to="/dashboard/transactions"
                className="hover:underline font-medium"
              >
                Transactions
              </Link>
              <Link
                to="/dashboard/account"
                className="hover:underline font-medium"
              >
                Account
              </Link>
              <Button onClick={logout}>Log out</Button>
            </nav>
          </div>
        </header>
        <main className="max-w-[300px] w-full space-y-6 px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
