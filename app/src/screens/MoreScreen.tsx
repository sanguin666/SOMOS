import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { AccessibleButton } from '../components/AccessibleButton';
import { AccessibleText } from '../components/AccessibleText';
import {
  CalendarIcon,
  CandleIcon,
  ChatBubbleIcon,
  ChevronRightIcon,
  ExitIcon,
  HeartIcon,
  MegaphoneIcon,
  PinIcon,
  PlayIcon,
  PlusIcon,
} from '../components/icons';
import { hubMenu, type HubTab } from '../components/PoiShell';
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
  onAddPlace: () => void;
  // Resolves once the membership is gone and the app has moved on, so
  // this screen knows when to stop showing its spinner.
  onLeavePlace: () => Promise<void>;
};

/**
 * What the bottom menu had no room for: the place's remaining modules
 * first, then the app's own settings under a divider. A full screen
 * rather than a sheet to drag up, and every row is a full-width target
 * with its name spelled out — the tab bar's labels are short by
 * necessity, this list has no such excuse.
 */
export function MoreScreen({
  poi,
  modules,
  onSelectTab,
  onOpenPlaces,
  onAddPlace,
  onLeavePlace,
}: Props) {
  const { t, language, setLanguage } = useI18n();
  const poiTheme = getPoiTheme(poi.type);
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveFailed, setLeaveFailed] = useState(false);

  async function leave() {
    setLeaving(true);
    setLeaveFailed(false);
    try {
      await onLeavePlace();
      setConfirmingLeave(false);
    } catch {
      setLeaveFailed(true);
    } finally {
      setLeaving(false);
    }
  }

  const rows = hubMenu(poi, modules).inMore.map((type) => ({
    type,
    icon: moduleIcon(type),
    label: moduleLabel(type, t),
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

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('places.addPlace')}
        onPress={onAddPlace}
        style={styles.row}
      >
        <PlusIcon size={26} color={colors.textMuted} />
        <AccessibleText variant="bodyLarge" style={styles.rowLabel}>
          {t('places.addPlace')}
        </AccessibleText>
        <ChevronRightIcon size={22} color={colors.textMuted} />
      </Pressable>

      {/* Last of the three, and the only one that undoes something, so it
          is the one that asks before acting. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('more.leavePlace')}
        onPress={() => {
          setLeaveFailed(false);
          setConfirmingLeave(true);
        }}
        style={styles.row}
      >
        <ExitIcon size={26} color={colors.danger} />
        <AccessibleText variant="bodyLarge" color={colors.danger} style={styles.rowLabel}>
          {t('more.leavePlace')}
        </AccessibleText>
      </Pressable>

      <Modal
        visible={confirmingLeave}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmingLeave(false)}
      >
        <Pressable
          style={styles.scrim}
          accessibilityLabel={t('more.leaveCancel')}
          onPress={() => !leaving && setConfirmingLeave(false)}
        />
        <View style={styles.confirmSheet}>
          <AccessibleText variant="title">
            {t('more.leaveQuestion', { poiName: poi.name })}
          </AccessibleText>
          <AccessibleText variant="body" color={colors.textMuted}>
            {t('more.leaveExplainer')}
          </AccessibleText>

          {leaveFailed && (
            <AccessibleText variant="body" color={colors.danger}>
              {t('more.leaveError')}
            </AccessibleText>
          )}

          {leaving ? (
            <View style={styles.leavingRow}>
              <ActivityIndicator color={colors.primaryStrong} size="large" />
            </View>
          ) : (
            <>
              <AccessibleButton label={t('more.leaveConfirm')} onPress={() => void leave()} />
              <AccessibleButton
                label={t('more.leaveCancel')}
                variant="secondary"
                onPress={() => setConfirmingLeave(false)}
              />
            </>
          )}
        </View>
      </Modal>

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

// The list has room the tab bar's labels never do, so the modules are
// named in full here.
function moduleLabel(type: ModuleType, t: ReturnType<typeof useI18n>['t']): string {
  switch (type) {
    case 'prayer_requests':
      return t('more.prayerRequests');
    case 'community':
      return t('more.community');
    case 'livestreams':
      return t('livestream.title');
    case 'events':
      return t('events.title');
    case 'announcements':
      return t('announcements.title');
    case 'donations':
      return t('hub.donationsLabel');
  }
}

function moduleIcon(type: ModuleType): (color: string) => ReactNode {
  switch (type) {
    case 'prayer_requests':
      return (color) => <CandleIcon size={26} color={color} />;
    case 'community':
      return (color) => <ChatBubbleIcon size={26} color={color} />;
    case 'livestreams':
      return (color) => <PlayIcon size={26} color={color} />;
    case 'events':
      return (color) => <CalendarIcon size={26} color={color} />;
    case 'announcements':
      return (color) => <MegaphoneIcon size={26} color={color} />;
    case 'donations':
      return (color) => <HeartIcon size={26} color={color} />;
  }
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
    backgroundColor: colors.surface,
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
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(17,17,17,0.45)',
  },
  confirmSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  leavingRow: {
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: colors.surface,
  },
  languageButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
});
