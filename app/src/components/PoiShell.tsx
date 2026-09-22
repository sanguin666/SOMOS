import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from './Screen';
import { AccessibleText } from './AccessibleText';
import { Avatar } from './Avatar';
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
import type { Me } from '../api/auth';
import { colors, floatingShadow, minTouchTarget, radii, spacing } from '../theme/theme';
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

// Home takes the first button, leaving four for the place's modules —
// and when it has more than four, the last of them becomes More.
const BAR_SLOTS = MAX_TABS - 1;

// Where a module sits in a place that has not arranged its own menu:
// the three things people open the app for, then the two they come back
// to, and the livestream last because the events screen already offers
// it. A place reorders this in the dashboard.
const DEFAULT_MENU_ORDER: ModuleType[] = [
  'events',
  'announcements',
  'donations',
  'prayer_requests',
  'community',
  'livestreams',
];

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

// Everything the place has switched on, in its own order, with anything
// it never arranged falling in behind in the default order.
function orderedLiveModules(poi: Poi, live: Set<ModuleType>): ModuleType[] {
  const chosen = (poi.menuOrder ?? []).filter((type) => live.has(type));
  const rest = DEFAULT_MENU_ORDER.filter((type) => live.has(type) && !chosen.includes(type));
  return [...chosen, ...rest];
}

// How many modules keep a button of their own: all of them when they
// fit, one fewer than the slots when More has to take the last one.
function barModuleCount(total: number): number {
  return total <= BAR_SLOTS ? total : BAR_SLOTS - 1;
}

export type HubMenu = {
  // The modules with a button of their own, in bar order.
  onBar: ModuleType[];
  // The modules the More screen lists. Empty means no More button: a
  // place with few modules gets a shorter bar rather than a button
  // hiding a single thing.
  inMore: ModuleType[];
  // Whether the livestream is reached from the top of the events screen
  // instead of a button or a More row.
  livestreamInEvents: boolean;
};

/**
 * Who goes where in the bottom menu, from the order the place set in the
 * dashboard and the modules it currently has running.
 */
export function hubMenu(poi: Poi, modules: ActiveModule[] | null): HubMenu {
  const live = liveModules(modules);
  const ordered = orderedLiveModules(poi, live);

  // The livestream is the one module with somewhere else to live: the
  // events screen carries it at the top. A place that did not lift it
  // onto the bar gets it there rather than as one more row under More.
  const livestreamInEvents =
    live.has('livestreams') &&
    live.has('events') &&
    ordered.indexOf('livestreams') >= barModuleCount(ordered.length);

  const placed = livestreamInEvents ? ordered.filter((type) => type !== 'livestreams') : ordered;
  const onBarCount = barModuleCount(placed.length);

  return {
    onBar: placed.slice(0, onBarCount),
    inMore: placed.slice(onBarCount),
    livestreamInEvents,
  };
}

/**
 * Persistent chrome for everything under a POI: the banner on top and the
 * menu at the bottom stay mounted while `children` swaps, so neither one
 * moves or flickers when a button is pressed — only the highlight does.
 * Both clear the device's system UI via `Screen`.
 */
export function PoiShell({
  poi,
  modules,
  me,
  activeTab,
  onSelectTab,
  onOpenPlaces,
  onOpenProfile,
  children,
}: Props) {
  const { t } = useI18n();
  const poiTheme = getPoiTheme(poi.type);

  const { onBar, inMore, livestreamInEvents } = hubMenu(poi, modules);

  const tabs: HubTab[] = ['home', ...onBar, ...(inMore.length > 0 ? (['more'] as HubTab[]) : [])];

  // Home alone is not a menu: a place with nothing switched on shows its
  // page and no bar at all.
  const showTabBar = onBar.length > 0 || inMore.length > 0;

  // The button that lights up for the screen showing. A screen reached
  // from somewhere other than the bar still lights the button it lives
  // under, so the bar always says where you are.
  const highlighted: HubTab = tabs.includes(activeTab)
    ? activeTab
    : activeTab === 'livestreams' && livestreamInEvents
      ? 'events'
      : 'more';

  const header = (
    <View style={styles.hero}>
      <LogoMark size={30} />

      {/* The name block is the switcher's target. It takes whatever width
          is left over, so the profile circle beside it never gets pushed
          off a narrow phone by a long parish name. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${poi.name}. ${t('hub.switchPlace')}`}
        onPress={onOpenPlaces}
        style={styles.heroTitleBlock}
      >
        <View style={styles.heroNameRow}>
          <AccessibleText variant="body" numberOfLines={1} style={styles.heroName}>
            {poi.name}
          </AccessibleText>
          <ChevronDownIcon size={18} color={colors.text} />
        </View>
        <AccessibleText
          variant="caption"
          color={colors.textMuted}
          numberOfLines={1}
          style={styles.heroLocation}
        >
          {poi.city ?? t('hub.locationNotSet')}
        </AccessibleText>
      </Pressable>

      {/* Signed in or not, the circle is in the same place and opens the
          same screen — which offers signing in when there is no session,
          rather than the button quietly disappearing. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          me ? `${t('profile.title')}. ${displayName(me)}` : t('profile.openSignedOut')
        }
        onPress={onOpenProfile}
        style={styles.profileButton}
      >
        <Avatar me={me} size={48} />
      </Pressable>
    </View>
  );

  const footer = showTabBar ? (
    <View style={styles.tabBar}>
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
      headerStyle={styles.headerSlot}
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
  // The signed-in person, or null when nobody is — what the profile
  // circle draws.
  me: Me | null;
  activeTab: HubTab;
  onSelectTab: (tab: HubTab) => void;
  // Opens the place switcher; the banner only reports the tap so the
  // switcher's state lives with whoever owns the place list.
  onOpenPlaces: () => void;
  // Opens the settings menu behind the profile circle, on the same terms.
  onOpenProfile: () => void;
  children: ReactNode;
};

/** Whatever name someone has given, for the profile button's label. */
function displayName(me: Me): string {
  return [me.firstName, me.lastName].filter(Boolean).join(' ').trim() || (me.phone ?? '');
}

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
      {/* Selection is a filled rounded pill plus a bolded, coral label —
          the line that used to mark it ran along an edge the bar no
          longer has. */}
      {icon(color)}
      <AccessibleText variant="caption" color={color} numberOfLines={1} style={active ? styles.tabBarLabelActive : styles.tabBarLabel}>
        {label}
      </AccessibleText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // The slot itself is only the page colour behind the status bar — the
  // white card inside it is what people see as the top bar.
  headerSlot: {
    backgroundColor: colors.background,
  },
  hero: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...floatingShadow,
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
  // A 48pt circle inside a full-size target, so the picture stays a
  // picture rather than growing to fill the touch area.
  profileButton: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSlot: {
    backgroundColor: colors.background,
  },
  // Lifted off the bottom on all four sides. The page ends above it
  // rather than running underneath, so the last line of a screen is
  // never hidden behind a button.
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    // Clear of the bottom edge on a phone with no gesture bar to add its
    // own inset.
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    ...floatingShadow,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: minTouchTarget,
    borderRadius: radii.lg,
    marginVertical: spacing.xs,
    // Kept tight so a bolded label still fits across five buttons on a
    // narrow phone rather than truncating.
    paddingHorizontal: 2,
    paddingVertical: spacing.xs,
  },
  tabBarLabel: {
    fontWeight: '500',
  },
  tabBarLabelActive: {
    fontWeight: '800',
  },
});
