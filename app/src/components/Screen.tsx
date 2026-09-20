import { type ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  // A persistent bar pinned below the (scrollable) content — e.g. the
  // hub screen's mini module menu. Sits inside the same SafeAreaView, so
  // it still clears the bottom safe area (home indicator, etc).
  footer?: ReactNode;
};

/**
 * Standard wrapper for every screen: high-contrast background, generous
 * margins, and respects the safe area (notch/system bars).
 */
export function Screen({ children, scroll = false, footer }: Props) {
  const Content = scroll ? ScrollView : View;
  const contentProps = scroll
    ? { contentContainerStyle: styles.content, style: styles.scrollFlex }
    : { style: styles.content };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Content {...contentProps}>{children}</Content>
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollFlex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
});
