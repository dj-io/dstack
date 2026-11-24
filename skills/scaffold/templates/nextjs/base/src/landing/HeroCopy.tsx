import { Heading } from '@/primitives/Heading';
import { Stack } from '@/primitives/Stack';
import { Text } from '@/primitives/Text';

/** Headline and one-line pitch. */
export function HeroCopy() {
  return (
    <Stack gap="md" centered>
      <Heading level={1}>__APP_NAME__</Heading>
      <Text tone="lead">Replace this pitch with what the product does, in one sentence.</Text>
    </Stack>
  );
}
