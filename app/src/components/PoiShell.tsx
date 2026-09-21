import { type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from './Screen';
import { AccessibleText } from './AccessibleText';
import {
  BackChevronIcon,
  BellIcon,
  CalendarIcon,
  CandleIcon,
  ChatBubbleIcon,
  HeartIcon,
  LogoMark,
  MegaphoneIcon,
  PlayIcon,
} from './icons';
import type { ActiveModule, ModuleType, Poi } from '../api/types';
import { colors, minTouchTarget, radii, spacing } from '../theme/theme';
import { getPoiTheme } from '../theme/poiThemes';
import { useI18n } from '../i18n/I18nContext';

// 'home' is the hub's landing feed. It is a tab value but not a tab button:
// the banner's back chevron is what returns to it, which keeps the bar down
// to one button per module and their labels readable.
export type HubTab = 'home' | ModuleType;

type Props = {
  poi: Poi;
  // null while the module list is still loading.
  modules: ActiveModule[] | null;
  activeTab: HubTab;
  onSelectTab: (tab: HubTab) => void;
  onBack: () => void;
  children: ReactNode;
};

// Above this many tabs, splitting the width evenly would drop each one
// below the app's minimum touch target and start truncating labels, so the
// bar scrolls instead.
const MAX_EVENLY_SPLIT_TABS = 6;

function isLive(module: ActiveModule) {
  return module.status !== 'expired' && module.status !== 'cancelled';
}

/**
 * Persistent chrome for everything under a POI: the banner on top and the
 * module tab bar at the bottom stay mounted while `children` swaps, so
 * neither one moves or flickers when a tab is selected — only the
 * highlight does. Both clear the device's system UI via `Screen`.
 */
export function PoiShell({ poi, modules, activeTab, onSelectTab, onBack, children }: Props) {
  const { t } = useI18n();
  const poiTheme = getPoiTheme(poi.type);

  const has = (type: ModuleType) => modules?.some((m) => m.moduleType === type && isLive(m)) ?? false;

  const tabs: { tab: HubTab; icon: (color: string) => ReactNode; label: string }[] = [
    ...(has('donations')
      ? [{ tab: 'donations' as const, icon: (c: string) => <HeartIcon size={24} color={c} />, label: t('hub.donationsLabel') }]
      : []),
    ...(has('events')
      ? [{ tab: 'events' as const, icon: (c: string) => <CalendarIcon size={24} color={c} />, label: t('hub.eventsLabel') }]
      : []),
    ...(has('announcements')
      ? [{ tab: 'announcements' as const, icon: (c: string) => <MegaphoneIcon size={24} color={c} />, label: t('hub.announcementsLabel') }]
      : []),
    ...(has('prayer_requests')
      ? [{ tab: 'prayer_requests' as const, icon: (c: string) => <CandleIcon size={24} color={c} />, label: t('hub.prayerRequestsLabel') }]
      : []),
    ...(has('livestreams')
      ? [{ tab: 'livestreams' as const, icon: (c: string) => <PlayIcon size={24} color={c} />, label: t('hub.livestreamLabel') }]
      : []),
    ...(has('community')
      ? [{ tab: 'community' as const, icon: (c: string) => <ChatBubbleIcon size={24} color={c} />, label: t('hub.communityLabel') }]
      : []),
  ];

  const showTabBar = tabs.length > 0;
  const scrolls = tabs.length > MAX_EVENLY_SPLIT_TABS;

  const header = (
    <View style={styles.hero}>
      <LogoMark size={32} haloColor={colors.surface} />

      <View style={styles.heroTitleBlock}>
        <AccessibleText
          variant="bodyLarge"
          color={poiTheme.accentText}
          numberOfLines={1}
          style={styles.heroName}
        >
          {poi.name}
        </AccessibleText>
        <AccessibleText
          variant="body"
          color="rgba(255,255,255,0.85)"
          numberOfLines={1}
          style={styles.heroLocation}
        >
          {poi.city ?? t('hub.locationNotSet')}
        </AccessibleText>
      </View>

      <View style={styles.iconButton}>
        <BellIcon size={18} color="#FFFFFF" />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        onPress={activeTab === 'home' ? onBack : () => onSelectTab('home')}
        style={styles.iconButton}
      >
        <BackChevronIcon size={16} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  const items = tabs.map(({ tab, icon, label }) => (
    <TabBarItem
      key={tab}
      icon={icon}
      label={label}
      active={tab === activeTab}
      activeColor={poiTheme.accentStrong}
      activeBackground={poiTheme.accentSoft}
      fixedWidth={scrolls}
      onPress={() => onSelectTab(tab)}
    />
  ));

  const footer = showTabBar ? (
    scrolls ? (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarScrollContent}
        style={styles.tabBar}
      >
        {items}
      </ScrollView>
    ) : (
      <View style={[styles.tabBar, styles.tabBarRow]}>{items}</View>
    )
  ) : null;

  return (
    <Screen
      scroll
      header={header}
      headerStyle={[styles.headerSlot, { backgroundColor: poiTheme.accent }]}
      footer={footer}
      footerStyle={styles.footerSlot}
    >
      {children}
    </Screen>
  );
}

function TabBarItem({
  icon,
  label,
  active,
  activeColor,
  activeBackground,
  fixedWidth,
  onPress,
}: {
  icon: (color: string) => ReactNode;
  label: string;
  active: boolean;
  activeColor: string;
  activeBackground: string;
  fixedWidth: boolean;
  onPress: () => void;
}) {
  const color = active ? activeColor : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.tabBarItem,
        fixedWidth ? styles.tabBarItemFixed : styles.tabBarItemFlex,
        active && { backgroundColor: activeBackground },
      ]}
    >
      <View style={[styles.tabBarIndicator, active && { backgroundColor: activeColor }]} />
      {icon(color)}
      <AccessibleText variant="caption" color={color} numberOfLines={1} style={active ? styles.tabBarLabelActive : styles.tabBarLabel}>
        {label}
      </AccessibleText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerSlot: {
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
    overflow: 'hidden',
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitleBlock: {
    flex: 1,
  },
  heroName: {
    fontWeight: '800',
  },
  heroLocation: {
    fontWeight: '700',
  },
  footerSlot: {
    backgroundColor: colors.background,
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  tabBarRow: {
    flexDirection: 'row',
  },
  tabBarScrollContent: {
    flexGrow: 1,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: minTouchTarget,
    // Kept tight so a bolded label still fits across six tabs on a narrow
    // phone rather than truncating.
    paddingHorizontal: 2,
    paddingBottom: spacing.xs,
  },
  tabBarItemFlex: {
    flex: 1,
  },
  tabBarItemFixed: {
    minWidth: 76,
  },
  // Sits flush under the bar's top border so the selected tab reads as
  // focused at a glance, not only by color.
  tabBarIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
  },
  tabBarLabel: {
    fontWeight: '500',
  },
  tabBarLabelActive: {
    fontWeight: '800',
  },
});
