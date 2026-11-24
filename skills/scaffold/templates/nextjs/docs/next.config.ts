import path from 'node:path';
import createMDX from '@next/mdx';
import withStylexTurbopack from '@stylexswc/nextjs-plugin/turbopack';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
};

const withMDX = createMDX({});

export default withStylexTurbopack({
  rsOptions: {
    dev: process.env.NODE_ENV !== 'production',
    aliases: { '@/*': [path.join(import.meta.dirname, 'src', '*')] },
  },
})(withMDX(nextConfig));
