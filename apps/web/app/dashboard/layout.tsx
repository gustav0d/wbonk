import { Suspense } from 'react';
import { Outlet, NavLink, Navigate } from 'react-router';
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
            <nav className="flex items-center gap-4 font-medium">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'underline' : '')}
                end
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/dashboard/create-transaction"
                className={({ isActive }) => (isActive ? 'underline' : '')}
              >
                New transaction
              </NavLink>
              <NavLink
                to="/dashboard/transactions"
                className={({ isActive }) => (isActive ? 'underline' : '')}
              >
                All transactions
              </NavLink>
              <NavLink
                to="/dashboard/account"
                className={({ isActive }) => (isActive ? 'underline' : '')}
              >
                Account
              </NavLink>
              <Button onClick={logout}>Log out</Button>
            </nav>
          </div>
        </header>
        <main className="max-w-[900px] w-full space-y-6 px-4">
          <Suspense fallback="loading...">
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
