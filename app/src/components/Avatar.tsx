import { Image, StyleSheet, View } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { PersonIcon } from './icons';
import { uploadUri } from '../api/client';
import type { Me } from '../api/auth';
import { colors } from '../theme/theme';

/**
 * Somebody's picture, in a circle, with two fallbacks: their initials when
 * they have a name but no picture, and a drawn person when they have
 * neither — which is also what everyone signed out sees.
 *
 * Purely visual: it never handles a press, so the header and the settings
 * screen can each wrap it in whatever target size they need.
 */
export function Avatar({ me, size }: { me: Me | null; size: number }) {
  const circle = { width: size, height: size, borderRadius: size / 2 };
  const initials = initialsOf(me);

  if (me?.avatarUrl) {
    return (
      <Image
        source={{ uri: uploadUri(me.avatarUrl) }}
        style={[circle, styles.photo]}
        // Decorative: whatever wraps this already carries the label, and
        // "profile picture" read twice helps nobody.
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    );
  }

  if (initials) {
    return (
      <View style={[circle, styles.initials]}>
        <AccessibleText
          variant="body"
          color={colors.primaryText}
          style={[styles.initialsText, { fontSize: Math.round(size * 0.4) }]}
        >
          {initials}
        </AccessibleText>
      </View>
    );
  }

  return (
    <View style={[circle, styles.empty]}>
      <PersonIcon size={Math.round(size * 0.58)} color={colors.textMuted} />
    </View>
  );
}

/**
 * One letter from each name someone gave, up to two. Somebody who signed
 * in with a phone number and skipped the name field has none, which is
 * why this can come back empty.
 */
export function initialsOf(me: Me | null): string {
  const letters = [me?.firstName, me?.lastName]
    .map((name) => name?.trim()?.[0])
    .filter((letter): letter is string => Boolean(letter));
  return letters.join('').toUpperCase();
}

const styles = StyleSheet.create({
  photo: {
    backgroundColor: colors.background,
  },
  initials: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontWeight: '800',
  },
  empty: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
