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
      index('./dashboard/home.tsx'),
      route('new-transaction', './dashboard/new-transaction.tsx'),
      route('account', './dashboard/user-account.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
