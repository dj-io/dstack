import stylexjs from '@stylexjs/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import boundaries from 'eslint-plugin-boundaries';
import noBarrelFiles from 'eslint-plugin-no-barrel-files';
import { defineConfig, globalIgnores } from 'eslint/config';
import dstack from './eslint/plugin.mjs';

/**
 * Names Next.js reads from route convention files. These files may export
 * only these, so helpers can't hide next to a page or route handler.
 */
const NEXT_CONVENTION_EXPORTS = [
  'default', 'metadata', 'generateMetadata', 'viewport', 'generateViewport',
  'generateStaticParams', 'generateImageMetadata', 'generateSitemaps',
  'dynamic', 'dynamicParams', 'revalidate', 'fetchCache', 'runtime',
  'preferredRegion', 'maxDuration', 'alt', 'size', 'contentType',
  'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS',
];

const NEXT_CONVENTION_FILES =
  'src/app/**/{page,layout,template,loading,error,not-found,global-error,default,route,opengraph-image,twitter-image,icon,apple-icon,sitemap,robots,manifest}.{ts,tsx}';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
  {
    files: ['**/*.{ts,tsx,mjs}'],
    plugins: { dstack, 'no-barrel-files': noBarrelFiles },
    rules: {
      'dstack/one-export-per-file': 'error',
      'dstack/module-comments-jsdoc': 'error',
      'no-barrel-files/no-barrel-files': 'error',
    },
  },
  {
    files: [NEXT_CONVENTION_FILES],
    rules: { 'dstack/one-export-per-file': ['error', { onlyNames: NEXT_CONVENTION_EXPORTS }] },
  },
  {
    files: ['src/proxy.ts'],
    rules: { 'dstack/one-export-per-file': ['error', { onlyNames: ['proxy', 'config'] }] },
  },
  {
    files: ['src/**/*.tsx'],
    rules: { 'dstack/max-raw-elements': ['error', { max: 3 }] },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries, '@stylexjs': stylexjs },
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true } },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', partialMatch: false },
        { type: 'primitives', pattern: 'src/primitives', partialMatch: false },
        { type: 'lib', pattern: 'src/lib', partialMatch: false },
        { type: 'feature', pattern: 'src/*', partialMatch: false, capture: ['feature'] },
      ],
    },
    rules: {
      '@stylexjs/valid-styles': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { types: ['app', 'feature', 'primitives', 'lib'] } } },
            },
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: [
                  { element: { type: 'feature', captured: { feature: '{{ from.element.captured.feature }}' } } },
                  { element: { types: ['primitives', 'lib'] } },
                ],
              },
            },
            {
              from: { element: { type: 'primitives' } },
              allow: { to: { element: { types: ['primitives', 'lib'] } } },
            },
            {
              from: { element: { type: 'lib' } },
              allow: { to: { element: { type: 'lib' } } },
            },
          ],
        },
      ],
    },
  },
]);
