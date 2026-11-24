import * as stylex from '@stylexjs/stylex';
import { spacing } from '@/primitives/spacing.stylex';
import { Stack } from '@/primitives/Stack';
import { HeroActions } from './HeroActions';
import { HeroCopy } from './HeroCopy';

const styles = stylex.create({
  hero: { paddingBlock: spacing.xl, paddingInline: spacing.md },
});

/** Above-the-fold headline, pitch and calls to action. */
export function Hero() {
  return (
    <section {...stylex.props(styles.hero)}>
      <Stack gap="lg" centered>
        <HeroCopy />
        <HeroActions />
      </Stack>
    </section>
  );
}
