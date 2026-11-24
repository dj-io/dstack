import type { MDXComponents } from 'mdx/types';
import { DocsCode } from '@/docs/DocsCode';
import { DocsHeading } from '@/docs/DocsHeading';
import { DocsLink } from '@/docs/DocsLink';
import { Text } from '@/primitives/Text';

const components: MDXComponents = {
  h1: ({ children }) => <DocsHeading level={1}>{children}</DocsHeading>,
  h2: ({ children }) => <DocsHeading level={2}>{children}</DocsHeading>,
  h3: ({ children }) => <DocsHeading level={3}>{children}</DocsHeading>,
  p: ({ children }) => <Text>{children}</Text>,
  a: ({ href, children }) => <DocsLink href={href ?? '#'}>{children}</DocsLink>,
  code: ({ children }) => <DocsCode>{children}</DocsCode>,
};

/** Maps MDX output to the docs feature's components. Next.js reads this file by name. */
export function useMDXComponents(): MDXComponents {
  return components;
}
