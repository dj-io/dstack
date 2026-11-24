import { Stack } from '@/primitives/Stack';
import { DocsNavLink } from './DocsNavLink';
import { docsNav } from './docsNav';

/** Lists every docs page from docsNav. */
export function DocsSidebar() {
  return (
    <Stack as="nav" gap="sm">
      {docsNav.map((entry) => (
        <DocsNavLink key={entry.href} href={entry.href}>
          {entry.title}
        </DocsNavLink>
      ))}
    </Stack>
  );
}
