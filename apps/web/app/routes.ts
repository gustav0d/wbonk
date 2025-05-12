import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('home.tsx'),

  layout('./auth/layout.tsx', [
    route('login', './auth/sign-in.tsx'),
    route('register', './auth/sign-up.tsx'),
  ]),

  ...prefix('dashboard', [
    layout('./dashboard/layout.tsx', [
      index('./dashboard/dashboard-home.tsx'),
      route(
        'create-transaction',
        './dashboard/create-transaction/create-transaction.tsx'
      ),
      route('transactions', './dashboard/transactions.tsx'),
      route('account', './dashboard/user-account.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
