import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from './Screen';
import { AccessibleText } from './AccessibleText';
import {
  CalendarIcon,
  CandleIcon,
  ChatBubbleIcon,
  ChevronDownIcon,
  HeartIcon,
  HomeIcon,
  LogoMark,
  MegaphoneIcon,
  MoreDotsIcon,
  PlayIcon,
} from './icons';
import type { ActiveModule, ModuleType, Poi } from '../api/types';
import { colors, minTouchTarget, radii, spacing } from '../theme/theme';
import { getPoiTheme } from '../theme/poiThemes';
import { useI18n } from '../i18n/I18nContext';

// Every screen the hub can show. 'home' is the place's own landing page
// and 'more' is the list of whatever the bar had no room for; the rest
// are the modules themselves.
export type HubTab = 'home' | 'more' | ModuleType;

// The bar's ceiling. Split evenly across a 390pt phone that is 78pt per
// button; a sixth would drop every button under `minTouchTarget` and
// start truncating the labels, which is what used to force the bar to
// scroll sideways.
const MAX_TABS = 5;

// The modules that give up their button first when the bar is full, in
// the order they appear under More. They go last because a place's
// calendar, its notices and its donations are what people open the app
// for; these two are what they come back to.
const OVERFLOW_ORDER: ModuleType[] = ['prayer_requests', 'community'];

function isLive(module: ActiveModule) {
  return module.status !== 'expired' && module.status !== 'cancelled';
}

function liveModules(modules: ActiveModule[] | null): Set<ModuleType> {
  const live = new Set<ModuleType>();
  for (const module of modules ?? []) {
    if (isLive(module)) live.add(module.moduleType);
  }
  return live;
}

/**
 * The buttons between Home and More, in bar order. The livestream rides
 * along with events rather than taking a button of its own — it only
 * gets one in a place that streams without keeping a calendar.
 */
function primaryTabs(live: Set<ModuleType>): ModuleType[] {
  const tabs: ModuleType[] = [];
  if (live.has('events')) tabs.push('events');
  else if (live.has('livestreams')) tabs.push('livestreams');
  if (live.has('announcements')) tabs.push('announcements');
  if (live.has('donations')) tabs.push('donations');
  return tabs;
}

/**
 * Which modules the More screen lists. Empty when they all fit on the
 * bar, in which case no More button is drawn either: a place with few
 * modules just gets a shorter bar, never a button hiding one thing.
 */
export function moreMenuModules(modules: ActiveModule[] | null): ModuleType[] {
  const live = liveModules(modules);
  const overflow = OVERFLOW_ORDER.filter((type) => live.has(type));
  return primaryTabs(live).length + overflow.length <= MAX_TABS - 1 ? [] : overflow;
}

/**
 * Persistent chrome for everything under a POI: the banner on top and the
 * menu at the bottom stay mounted while `children` swaps, so neither one
 * moves or flickers when a button is pressed — only the highlight does.
 * Both clear the device's system UI via `Screen`.
 */
export function PoiShell({ poi, modules, activeTab, onSelectTab, onOpenPlaces, children }: Props) {
  const { t } = useI18n();
  const poiTheme = getPoiTheme(poi.type);

  const live = liveModules(modules);
  const primary = primaryTabs(live);
  const overflow = OVERFLOW_ORDER.filter((type) => live.has(type));
  const collapses = primary.length + overflow.length > MAX_TABS - 1;

  const tabs: HubTab[] = ['home', ...primary, ...(collapses ? (['more'] as HubTab[]) : overflow)];

  // Home alone is not a menu: a place with nothing switched on shows its
  // page and no bar at all.
  const showTabBar = primary.length + overflow.length > 0;

  // The button that lights up for the screen showing. A screen reached
  // from somewhere other than the bar still lights the button it lives
  // under, so the bar always says where you are.
  const highlighted: HubTab = tabs.includes(activeTab)
    ? activeTab
    : activeTab === 'livestreams'
      ? 'events'
      : 'more';

  const header = (
    <View style={styles.hero}>
      <LogoMark size={32} haloColor={colors.surface} />

      {/* The whole name block is the switcher's target: it is the largest
          thing in the banner, so it stays easy to hit. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${poi.name}. ${t('hub.switchPlace')}`}
        onPress={onOpenPlaces}
        style={styles.heroTitleBlock}
      >
        <View style={styles.heroNameRow}>
          <AccessibleText
            variant="bodyLarge"
            color={poiTheme.accentText}
            numberOfLines={1}
            style={styles.heroName}
          >
            {poi.name}
          </AccessibleText>
          <ChevronDownIcon size={18} color={poiTheme.accentText} />
        </View>
        <AccessibleText
          variant="body"
          color="rgba(255,255,255,0.85)"
          numberOfLines={1}
          style={styles.heroLocation}
        >
          {poi.city ?? t('hub.locationNotSet')}
        </AccessibleText>
      </Pressable>
    </View>
  );

  const footer = showTabBar ? (
    <View style={[styles.tabBar, styles.tabBarRow]}>
      {tabs.map((tab) => {
        const { icon, label } = describe(tab, t);
        return (
          <TabBarItem
            key={tab}
            icon={icon}
            label={label}
            active={tab === highlighted}
            activeColor={poiTheme.accentStrong}
            activeBackground={poiTheme.accentSoft}
            onPress={() => onSelectTab(tab)}
          />
        );
      })}
    </View>
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

type Props = {
  poi: Poi;
  // null while the module list is still loading.
  modules: ActiveModule[] | null;
  activeTab: HubTab;
  onSelectTab: (tab: HubTab) => void;
  // Opens the place switcher; the banner only reports the tap so the
  // switcher's state lives with whoever owns the place list.
  onOpenPlaces: () => void;
  children: ReactNode;
};

type Described = { icon: (color: string) => ReactNode; label: string };
type Translate = ReturnType<typeof useI18n>['t'];

function describe(tab: HubTab, t: Translate): Described {
  switch (tab) {
    case 'home':
      return { icon: (c) => <HomeIcon size={24} color={c} />, label: t('hub.homeLabel') };
    case 'events':
      return { icon: (c) => <CalendarIcon size={24} color={c} />, label: t('hub.eventsLabel') };
    case 'livestreams':
      return { icon: (c) => <PlayIcon size={24} color={c} />, label: t('hub.livestreamLabel') };
    case 'announcements':
      return { icon: (c) => <MegaphoneIcon size={24} color={c} />, label: t('hub.announcementsLabel') };
    case 'donations':
      return { icon: (c) => <HeartIcon size={24} color={c} />, label: t('hub.donationsLabel') };
    case 'prayer_requests':
      return { icon: (c) => <CandleIcon size={24} color={c} />, label: t('hub.prayerRequestsLabel') };
    case 'community':
      return { icon: (c) => <ChatBubbleIcon size={24} color={c} />, label: t('hub.communityLabel') };
    case 'more':
      return { icon: (c) => <MoreDotsIcon size={24} color={c} />, label: t('hub.moreLabel') };
  }
}

function TabBarItem({
  icon,
  label,
  active,
  activeColor,
  activeBackground,
  onPress,
}: {
  icon: (color: string) => ReactNode;
  label: string;
  active: boolean;
  activeColor: string;
  activeBackground: string;
  onPress: () => void;
}) {
  const color = active ? activeColor : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.tabBarItem, active && { backgroundColor: activeBackground }]}
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
  heroTitleBlock: {
    flex: 1,
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroName: {
    fontWeight: '800',
    flexShrink: 1,
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
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: minTouchTarget,
    // Kept tight so a bolded label still fits across five buttons on a
    // narrow phone rather than truncating.
    paddingHorizontal: 2,
    paddingBottom: spacing.xs,
  },
  // Sits flush under the bar's top border so the selected button reads as
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
