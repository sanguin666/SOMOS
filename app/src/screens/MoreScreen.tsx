import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { AccessibleButton } from '../components/AccessibleButton';
import { AccessibleText } from '../components/AccessibleText';
import {
  CalendarIcon,
  CandleIcon,
  ChaliceIcon,
  ChatBubbleIcon,
  CheckIcon,
  ChevronRightIcon,
  ClipboardIcon,
  ExitIcon,
  GlobeIcon,
  HeartIcon,
  MegaphoneIcon,
  PinIcon,
  PlayIcon,
  PlusIcon,
} from '../components/icons';
import { hubMenu, type HubTab } from '../components/PoiShell';
import type { ActiveModule, ModuleType, Poi } from '../api/types';
import { cardSurface, colors, minTouchTarget, radii, spacing } from '../theme/theme';
import { getPoiTheme } from '../theme/poiThemes';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';

/**
 * Each language written in itself, never translated. Somebody who opened
 * the app in a language they cannot read is exactly who this list is for,
 * and "Spanish" is no help to them where "Español" is.
 */
const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
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
  const [languageOpen, setLanguageOpen] = useState(false);
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

      {/* The line separates the modules from the place actions, so it
          only appears when there are modules above it. */}
      {rows.length > 0 && <View style={styles.divider} />}

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
        style={[styles.row, styles.rowDestructive]}
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
              {/* The act is the orange button every other screen uses
                  for its call to action; what the button says is what
                  makes it serious, not a colour of its own. */}
              <AccessibleButton
                label={t('more.leaveConfirm')}
                onPress={() => void leave()}
              />
              <AccessibleButton
                label={t('more.leaveCancel')}
                variant="secondary"
                onPress={() => setConfirmingLeave(false)}
              />
            </>
          )}
        </View>
      </Modal>

      {/* One row carrying the language it is currently set to, rather
          than three abbreviations side by side. The list itself only
          appears once somebody asks for it. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('home.languageLabel')}: ${LANGUAGE_NAMES[language]}`}
        onPress={() => setLanguageOpen(true)}
        style={styles.row}
      >
        <GlobeIcon size={26} color={colors.textMuted} />
        <AccessibleText variant="bodyLarge" style={styles.rowLabel}>
          {t('home.languageLabel')}
        </AccessibleText>
        <AccessibleText variant="body" color={colors.textMuted}>
          {LANGUAGE_NAMES[language]}
        </AccessibleText>
        <ChevronRightIcon size={22} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={languageOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageOpen(false)}
      >
        <Pressable
          style={styles.scrim}
          accessibilityLabel={t('places.close')}
          onPress={() => setLanguageOpen(false)}
        />
        <View style={styles.sheet}>
          <AccessibleText variant="title">{t('more.chooseLanguage')}</AccessibleText>

          {SUPPORTED_LANGUAGES.map((code, index) => {
            const selected = code === language;
            const last = index === SUPPORTED_LANGUAGES.length - 1;
            return (
              <Pressable
                key={code}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={LANGUAGE_NAMES[code]}
                onPress={() => {
                  setLanguage(code);
                  setLanguageOpen(false);
                }}
                style={[
                  styles.languageOption,
                  selected && styles.languageOptionSelected,
                  // A line under the last one would separate it from the
                  // Close button, which is not one of the choices.
                  last && styles.languageOptionLast,
                ]}
              >
                <AccessibleText
                  variant="bodyLarge"
                  color={selected ? colors.primaryStrong : colors.text}
                  style={styles.rowLabel}
                >
                  {LANGUAGE_NAMES[code]}
                </AccessibleText>
                {/* A tick as well as the colour, so the choice is not
                    carried by colour alone. */}
                {selected && <CheckIcon size={24} color={colors.primaryStrong} />}
              </Pressable>
            );
          })}

          <AccessibleButton
            label={t('places.close')}
            variant="secondary"
            onPress={() => setLanguageOpen(false)}
          />
        </View>
      </Modal>
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
    case 'requests':
      return t('requests.title');
    case 'mass_intentions':
      return t('intentions.title');
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
    case 'requests':
      return (color) => <ClipboardIcon size={26} color={color} />;
    case 'mass_intentions':
      return (color) => <ChaliceIcon size={26} color={color} />;
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
    ...cardSurface,
    borderRadius: radii.lg,
  },
  // The one row that destroys something wears the same heavy edge as the
  // Sign out button, so it never reads as one more place to tap through.
  rowDestructive: {
    borderWidth: 2,
    borderColor: colors.border,
  },
  rowLabel: {
    flex: 1,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.primary,
    marginVertical: spacing.xs,
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(17,17,17,0.45)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  // On the white sheet, so the options are rows told apart by a hairline
  // rather than boxes: the one in use is named by its colour and its
  // tick, not by a frame around it.
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: minTouchTarget + 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  languageOptionSelected: {},
  languageOptionLast: {
    borderBottomWidth: 0,
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
});
