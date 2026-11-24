import path from 'node:path';
import withStylexTurbopack from '@stylexswc/nextjs-plugin/turbopack';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withStylexTurbopack({
  rsOptions: {
    dev: process.env.NODE_ENV !== 'production',
    aliases: { '@/*': [path.join(import.meta.dirname, 'src', '*')] },
  },
})(nextConfig);
