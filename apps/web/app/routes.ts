import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('home.tsx'),
  route('login', './auth/sign-in.tsx'),
  route('register', './auth/sign-up.tsx'),
] satisfies RouteConfig;
