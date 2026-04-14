import * as React from "react";
import {
  LegendList as RNLegendList,
  type LegendListProps as RNLegendListProps,
  type LegendListRef as RNLegendListRef,
} from "@legendapp/list";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import {
  createSyncedTabScrollComponent,
  type TabPageProps,
  type TopTabItemRenderProps,
  type TabViewTopTabsProps,
} from "react-native-synced-tab-view";

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUM_COLUMNS = 3;
const GRID_GAP = 1;
const IMAGE_SIZE = (SCREEN_WIDTH - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
const ITEMS_PER_TAB = 200;
const TIKTOK_TAB_COUNT = 3;
const TAB_SLOT_WIDTH = SCREEN_WIDTH / TIKTOK_TAB_COUNT;
const SAVED_CARD_COVER_HEIGHT = 120;
const AVATAR_SIZE = 96;

export const VIDEO_CARD_HEIGHT = IMAGE_SIZE * 1.35;
export const SAVED_CARD_HEIGHT = 160;
export const PROFILE_HANDLE = "@creative_alex";
export const PROFILE_USERNAME = PROFILE_HANDLE.replace("@", "");
export const HEADER_NOTIFICATION_ICON_STYLE = { marginRight: 20 };
export const VIDEO_GRID_COLUMN_WRAPPER_STYLE = { gap: GRID_GAP };
export const VIDEO_GRID_CONTENT_CONTAINER_STYLE = { gap: GRID_GAP };
export const SAVED_COLUMN_WRAPPER_STYLE = { gap: 8, paddingHorizontal: 16 };
export const SAVED_CONTENT_CONTAINER_STYLE = { gap: 8, paddingVertical: 16 };
export const TIKTOK_SCROLLER_STYLE = { backgroundColor: "#121212" };
export const PROFILE_STATS = [
  { value: "182", label: "Following" },
  { value: "2.4M", label: "Followers" },
  { value: "38.6M", label: "Likes" },
] as const;

export type VideoItem = { id: string; color: string; views: string };
export type SavedCollectionItem = {
  id: string;
  color: string;
  count: number;
  label: string;
};

type SyncedLegendListProps<T> = RNLegendListProps<T> & {
  index: number;
  width?: number;
};

type SyncedLegendListRef = RNLegendListRef;

const InternalSyncedLegendList = createSyncedTabScrollComponent<
  RNLegendListProps<any>,
  SyncedLegendListRef
>(RNLegendList as unknown as React.ComponentType<any>);

type SyncedLegendListComponent = <T>(
  props: SyncedLegendListProps<T> & React.RefAttributes<SyncedLegendListRef>,
) => React.ReactElement | null;

const SyncedLegendListInner = <T,>(
  props: SyncedLegendListProps<T>,
  ref: React.ForwardedRef<SyncedLegendListRef>,
) => {
  return <InternalSyncedLegendList {...(props as any)} ref={ref} />;
};

const ForwardedSyncedLegendList = React.forwardRef(SyncedLegendListInner);
ForwardedSyncedLegendList.displayName = "TikTokExampleSyncedLegendList";

export const SyncedLegendList =
  ForwardedSyncedLegendList as SyncedLegendListComponent;

const VIDEO_CARD_COLORS = [
  "#1a1a2e",
  "#16213e",
  "#0f3460",
  "#533483",
  "#1b1b2f",
  "#2c2c54",
  "#40407a",
  "#2f3542",
  "#57606f",
  "#1e272e",
  "#485460",
  "#2d3436",
  "#636e72",
  "#353b48",
  "#2f3640",
  "#4a4a4a",
  "#3d3d3d",
  "#2e2e2e",
  "#1f1f1f",
  "#111111",
];

const VIDEO_VIEW_COUNTS = [
  "12.4M",
  "8.7M",
  "5.1M",
  "3.8M",
  "2.6M",
  "1.9M",
  "986K",
  "842K",
  "611K",
  "428K",
] as const;

export const SAVED_COLLECTIONS: SavedCollectionItem[] = [
  { id: "saved-design", color: "#2f3640", count: 24, label: "Design Notes" },
  { id: "saved-studio", color: "#353b48", count: 16, label: "Studio Setup" },
  { id: "saved-shoots", color: "#40407a", count: 31, label: "Shoot Ideas" },
  { id: "saved-color", color: "#2c2c54", count: 18, label: "Color Grading" },
  { id: "saved-edits", color: "#1b1b2f", count: 12, label: "Edit References" },
  { id: "saved-trends", color: "#485460", count: 44, label: "Trend Watch" },
  { id: "saved-audio", color: "#16213e", count: 27, label: "Audio Picks" },
  { id: "saved-briefs", color: "#533483", count: 9, label: "Client Briefs" },
  { id: "saved-lighting", color: "#111111", count: 14, label: "Lighting" },
  { id: "saved-travel", color: "#57606f", count: 22, label: "Travel Sets" },
  { id: "saved-fashion", color: "#2d3436", count: 19, label: "Wardrobe" },
  { id: "saved-campaigns", color: "#1e272e", count: 11, label: "Campaigns" },
];

export const buildVideoItems = (tabIndex: number) =>
  Array.from({ length: ITEMS_PER_TAB }, (_, itemIndex) => ({
    id: `video-${tabIndex}-${itemIndex}`,
    color: VIDEO_CARD_COLORS[itemIndex % VIDEO_CARD_COLORS.length],
    views: VIDEO_VIEW_COUNTS[(tabIndex + itemIndex) % VIDEO_VIEW_COUNTS.length],
  }));

const TikTokTabButton = ({
  item,
  onPress,
  onLayout,
}: TopTabItemRenderProps) => {
  const iconName =
    typeof item.icon === "string" && item.icon in Ionicons.glyphMap
      ? (item.icon as keyof typeof Ionicons.glyphMap)
      : "ellipsis-horizontal";

  return (
    <Pressable
      onPress={onPress}
      onLayout={(event) => onLayout(event as never)}
      style={[styles.tabItem, { width: TAB_SLOT_WIDTH }]}
    >
      <Ionicons name={iconName} size={22} color="#fff" />
    </Pressable>
  );
};

export const TIKTOK_TOP_TABS_PROPS = {
  backgroundColor: "#121212",
  containerStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  tabItemStyle: {
    paddingVertical: 10,
    width: TAB_SLOT_WIDTH,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  renderTabItem: TikTokTabButton,
  indicatorColor: "#fff",
  indicatorHeight: 2,
  indicatorWidth: TAB_SLOT_WIDTH,
  indicatorPosition: "bottom" as const,
  indicatorBorderRadius: 0,
  indicatorMarginBottom: 0,
  showIndicator: true,
} satisfies TabViewTopTabsProps;

export type TikTokTabPageProps = TabPageProps;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 58,
    paddingBottom: 10,
    backgroundColor: "#121212",
  },
  backButton: {
    padding: 4,
  },
  headerUsername: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#121212",
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    fontSize: 15,
    color: "#aaa",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  statDivider: {
    width: 0.5,
    height: 20,
    backgroundColor: "#444",
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 40,
  },
  followButton: {
    flex: 1,
    backgroundColor: "#FE2C55",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  messageButton: {
    width: 44,
    height: 44,
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  addFriendButton: {
    width: 44,
    height: 44,
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  bioSection: {
    paddingHorizontal: 40,
  },
  bioText: {
    fontSize: 14,
    color: "#eee",
    lineHeight: 20,
    textAlign: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  videoCard: {
    width: IMAGE_SIZE,
    height: VIDEO_CARD_HEIGHT,
  },
  videoOverlay: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  videoViews: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 18,
  },
  savedCard: {
    flex: 1,
  },
  savedCardCover: {
    height: SAVED_CARD_COVER_HEIGHT,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  savedCardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  savedCardCount: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
