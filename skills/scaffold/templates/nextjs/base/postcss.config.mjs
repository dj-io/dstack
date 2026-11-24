import path from 'node:path';

const config = {
  plugins: {
    '@stylexswc/postcss-plugin': {
      include: ['src/**/*.{ts,tsx}'],
      rsOptions: {
        dev: process.env.NODE_ENV === 'development',
        aliases: { '@/*': [path.join(process.cwd(), 'src', '*')] },
      },
    },
  },
};

export default config;
