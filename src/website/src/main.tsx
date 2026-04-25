import { ViteReactSSG } from 'vite-react-ssg';
import type { RouteRecord } from 'vite-react-ssg';
import { App } from './App';
import './index.css';

const routes: RouteRecord[] = [
  {
    path: '/',
    Component: App,
    entry: 'src/website/src/App.tsx',
  },
  {
    path: '/privacy',
    lazy: async () => {
      const { PrivacyPolicy } = await import('./PrivacyPolicy');
      return { Component: PrivacyPolicy };
    },
    entry: 'src/website/src/PrivacyPolicy.tsx',
  },
  {
    path: '/terms',
    lazy: async () => {
      const { TermsAndConditions } = await import('./TermsAndConditions');
      return { Component: TermsAndConditions };
    },
    entry: 'src/website/src/TermsAndConditions.tsx',
  },
];

export const createRoot = ViteReactSSG({ routes, basename: import.meta.env.BASE_URL });
