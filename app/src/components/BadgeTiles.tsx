import { Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { AlertIcon, CalendarIcon, ChaliceIcon, HeartIcon, MegaphoneIcon } from './icons';
import type { BadgeTile } from '../utils/badges';
import type { ModuleType } from '../api/types';
import { cardSurface, colors, minTouchTarget, radii, spacing } from '../theme/theme';

type Props = {
  tiles: BadgeTile[];
  // Unsaved in the dashboard's preview: drawn with a dashed edge.
  drafts?: Set<string>;
  onOpen: (module: ModuleType) => void;
};

function TileIcon({ icon, color }: { icon: BadgeTile['icon']; color: string }) {
  switch (icon) {
    case 'mass':
      return <ChaliceIcon size={18} color={color} />;
    case 'confession':
      return <CalendarIcon size={16} color={color} />;
    case 'campaign':
      return <HeartIcon size={15} color={colors.primary} />;
    case 'message':
      return <MegaphoneIcon size={20} color={color} />;
    case 'alert':
      return <AlertIcon size={22} color={color} />;
    case 'open':
    case 'closed':
      // Open is the brand's coral, closed a quiet grey: never the only
      // sign, the label says it in words.
      return <View style={[styles.dot, { backgroundColor: icon === 'open' ? colors.primary : '#9A8F82' }]} />;
  }
}

/**
 * The few things worth knowing before anything else, at the very top of
 * a place's home page: small white tiles two to a row, a small label
 * over a bold value, with the staff's messages across the full width.
 * An important message is the one strong orange on the page. Each tile
 * opens its module when there is one to open.
 */
export function BadgeTiles({ tiles, drafts, onOpen }: Props) {
  if (tiles.length === 0) return null;
  return (
    <View style={styles.grid}>
      {tiles.map((tile) => {
        const ink = tile.important ? colors.primaryText : colors.primaryStrong;
        const content = tile.wide ? (
          <View style={styles.wideRow}>
            <TileIcon icon={tile.icon} color={ink} />
            <AccessibleText
              variant="body"
              color={tile.important ? colors.primaryText : colors.text}
              style={styles.value}
            >
              {tile.value}
            </AccessibleText>
          </View>
        ) : (
          <>
            <View style={styles.labelRow}>
              <TileIcon icon={tile.icon} color={ink} />
              <AccessibleText variant="caption" color={colors.textMuted} style={styles.label} numberOfLines={1}>
                {tile.label}
              </AccessibleText>
            </View>
            <AccessibleText variant="body" style={styles.value}>
              {tile.value}
            </AccessibleText>
          </>
        );
        const style = [
          styles.tile,
          tile.wide && styles.wide,
          tile.important && styles.important,
          drafts?.has(tile.id) && styles.draft,
        ];
        const spoken = [tile.label, tile.value].filter(Boolean).join(', ');
        const opens = tile.opens;
        if (!opens) {
          return (
            <View key={tile.id} style={style} accessible accessibilityLabel={spoken}>
              {content}
            </View>
          );
        }
        return (
          <Pressable
            key={tile.id}
            accessibilityRole="button"
            accessibilityLabel={spoken}
            onPress={() => onOpen(opens)}
            style={({ pressed }) => [...style, pressed && styles.pressed]}
          >
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    ...cardSurface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md - 4,
    paddingVertical: spacing.sm,
    minHeight: minTouchTarget,
    justifyContent: 'center',
    // Two to a row. A tile left alone on the last row takes the row.
    flexBasis: '40%',
    flexGrow: 1,
  },
  wide: {
    flexBasis: '100%',
  },
  important: {
    // The darker coral, not the brand's: white text on it has to clear
    // 4.5:1, and this is text at body size.
    backgroundColor: colors.primaryStrong,
    borderColor: colors.primaryStrong,
  },
  draft: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primaryStrong,
  },
  pressed: {
    opacity: 0.75,
  },
  wideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontWeight: '600',
    flexShrink: 1,
  },
  value: {
    fontWeight: '800',
    flexShrink: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
