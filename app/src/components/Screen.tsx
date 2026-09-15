import { type ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

/**
 * Enveloppe standard de chaque écran : fond à fort contraste, marges
 * généreuses et zone sûre (encoche/barre système) respectée.
 */
export function Screen({ children, scroll = false }: Props) {
  const Content = scroll ? ScrollView : View;
  const contentProps = scroll
    ? { contentContainerStyle: styles.content }
    : { style: styles.content };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Content {...contentProps}>{children}</Content>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
});
