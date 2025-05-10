import path from 'path';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import graphql from '@rollup/plugin-graphql';
import relay from 'vite-plugin-relay';

export default defineConfig({
  plugins: [graphql(), tailwindcss(), reactRouter(), tsconfigPaths(), relay],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  ssr: {
    noExternal: [/^relay-runtime(?:\/|$)/, /react-relay(?:\/|$)/],
    optimizeDeps: {
      include: [
        'relay-runtime',
        'relay-runtime/experimental',
        'react-relay',
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
    },
  },
  optimizeDeps: {
    include: [
      'relay-runtime',
      'relay-runtime/experimental',
      'react-relay',
      'react',
      'react-dom',
      'react/jsx-runtime',
    ],
  },
});
