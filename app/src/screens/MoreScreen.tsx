import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import {
  CandleIcon,
  ChatBubbleIcon,
  ChevronRightIcon,
  PinIcon,
} from '../components/icons';
import { moreMenuModules, type HubTab } from '../components/PoiShell';
import type { ActiveModule, ModuleType, Poi } from '../api/types';
import { colors, minTouchTarget, radii, spacing } from '../theme/theme';
import { getPoiTheme } from '../theme/poiThemes';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

type Props = {
  poi: Poi;
  modules: ActiveModule[] | null;
  onSelectTab: (tab: HubTab) => void;
  onOpenPlaces: () => void;
};

/**
 * What the bottom menu had no room for: the place's remaining modules
 * first, then the app's own settings under a divider. A full screen
 * rather than a sheet to drag up, and every row is a full-width target
 * with its name spelled out — the tab bar's labels are short by
 * necessity, this list has no such excuse.
 */
export function MoreScreen({ poi, modules, onSelectTab, onOpenPlaces }: Props) {
  const { t, language, setLanguage } = useI18n();
  const poiTheme = getPoiTheme(poi.type);

  const rows = moreMenuModules(modules).map((type) => ({
    type,
    icon: moduleIcon(type),
    label: type === 'prayer_requests' ? t('more.prayerRequests') : t('more.community'),
  }));

  return (
    <>
      <View style={styles.titleBlock}>
        <AccessibleText variant="title">{t('more.title')}</AccessibleText>
      </View>

      {rows.map((row) => (
        <Pressable
          key={row.type}
          accessibilityRole="button"
          accessibilityLabel={row.label}
          onPress={() => onSelectTab(row.type)}
          style={styles.row}
        >
          {row.icon(poiTheme.accentStrong)}
          <AccessibleText variant="bodyLarge" style={styles.rowLabel}>
            {row.label}
          </AccessibleText>
          <ChevronRightIcon size={22} color={colors.textMuted} />
        </Pressable>
      ))}

      <View style={styles.divider} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('hub.switchPlace')}
        onPress={onOpenPlaces}
        style={styles.row}
      >
        <PinIcon size={26} color={colors.textMuted} />
        <AccessibleText variant="bodyLarge" style={styles.rowLabel}>
          {t('hub.switchPlace')}
        </AccessibleText>
        <ChevronRightIcon size={22} color={colors.textMuted} />
      </Pressable>

      <View style={styles.languageBlock}>
        <AccessibleText variant="caption" color={colors.textMuted}>
          {t('home.languageLabel')}
        </AccessibleText>
        <View style={styles.languageRow}>
          {SUPPORTED_LANGUAGES.map((code) => {
            const selected = code === language;
            return (
              <Pressable
                key={code}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={LANGUAGE_LABELS[code]}
                onPress={() => setLanguage(code)}
                style={[styles.languageButton, selected && styles.languageButtonSelected]}
              >
                <AccessibleText variant="body" color={selected ? colors.primaryText : colors.text}>
                  {LANGUAGE_LABELS[code]}
                </AccessibleText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}

function moduleIcon(type: ModuleType): (color: string) => ReactNode {
  return type === 'prayer_requests'
    ? (color) => <CandleIcon size={26} color={color} />
    : (color) => <ChatBubbleIcon size={26} color={color} />;
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: minTouchTarget + 14,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
  },
  rowLabel: {
    flex: 1,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.25,
    marginVertical: spacing.xs,
  },
  languageBlock: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  languageButton: {
    minWidth: 72,
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  languageButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
});
