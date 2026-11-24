import { Stack } from '@/primitives/Stack';
import { Hero } from './Hero';

/** Entry component for the landing feature, rendered by app/page.tsx. */
export function Landing() {
  return (
    <Stack as="main" gap="lg">
      <Hero />
    </Stack>
  );
}
