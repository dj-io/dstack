import { ButtonLink } from '@/primitives/ButtonLink';
import { Stack } from '@/primitives/Stack';

/** Primary and secondary calls to action. */
export function HeroActions() {
  return (
    <Stack direction="row" gap="sm">
      <ButtonLink href="#get-started">Get started</ButtonLink>
      <ButtonLink href="#learn-more" variant="secondary">
        Learn more
      </ButtonLink>
    </Stack>
  );
}
