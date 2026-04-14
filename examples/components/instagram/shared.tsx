import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  type TopTabItemRenderProps,
  type TabViewTopTabsProps,
} from "react-native-synced-tab-view";

export const INSTAGRAM_GRID_GAP = 2;
export const INSTAGRAM_NUM_COLUMNS = 3;
export const INSTAGRAM_ITEMS_PER_TAB = 200;
export const INSTAGRAM_REELS_ITEMS_COUNT = 1000;
export const INSTAGRAM_MEDIA_INITIAL_NUM_TO_RENDER = INSTAGRAM_NUM_COLUMNS * 4;
export const INSTAGRAM_GRID_COLUMN_WRAPPER_STYLE = { gap: INSTAGRAM_GRID_GAP };
export const INSTAGRAM_GRID_CONTENT_CONTAINER_STYLE = {
  gap: INSTAGRAM_GRID_GAP,
};
export const INSTAGRAM_SCROLLER_CONTAINER_STYLE = {
  backgroundColor: "#fff",
};

const AVATAR_SIZE = 86;
const INSTAGRAM_TAB_COUNT = 3;
const REELS_COLOR_OFFSET = 5;
const TAGGED_COLOR_OFFSET = 15;

export const INSTAGRAM_PROFILE_USERNAME = "jane_designer";
export const INSTAGRAM_PROFILE_STATS = [
  { value: "248", label: "Posts" },
  { value: "14.2K", label: "Followers" },
  { value: "826", label: "Following" },
] as const;
export const INSTAGRAM_PROFILE_HIGHLIGHTS: readonly {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: "Travel", icon: "airplane" },
  { label: "Design", icon: "color-palette" },
  { label: "Food", icon: "restaurant" },
  { label: "Pets", icon: "paw" },
];

const INSTAGRAM_PLACEHOLDER_COLORS = [
  "#E8B4B8",
  "#A9D0F5",
  "#C5E1A5",
  "#FFE082",
  "#CE93D8",
  "#80CBC4",
  "#FFAB91",
  "#B0BEC5",
  "#F48FB1",
  "#81D4FA",
  "#AED581",
  "#FFD54F",
  "#BA68C8",
  "#4DB6AC",
  "#FF8A65",
  "#90A4AE",
  "#F06292",
  "#4FC3F7",
  "#7CB342",
  "#FFC107",
  "#AB47BC",
  "#26A69A",
  "#FF7043",
  "#78909C",
  "#EC407A",
  "#29B6F6",
  "#689F38",
  "#FFB300",
  "#8E24AA",
  "#009688",
] as const;

export type InstagramGridItem = { id: string; color: string };
export type InstagramReelItem = { id: string; color: string; views: string };

export type InstagramGridTabProps = {
  index: number;
  width?: number;
  imageSize: number;
};

export type InstagramReelsTabProps = InstagramGridTabProps & {
  reelHeight: number;
};

const createGridData = (prefix: string, count: number, colorOffset = 0) =>
  Array.from({ length: count }, (_, itemIndex) => ({
    id: `${prefix}-${itemIndex}`,
    color:
      INSTAGRAM_PLACEHOLDER_COLORS[
        (itemIndex + colorOffset) % INSTAGRAM_PLACEHOLDER_COLORS.length
      ],
  }));

const createReelData = (count: number) =>
  Array.from({ length: count }, (_, itemIndex) => ({
    id: `reels-${itemIndex}`,
    color:
      INSTAGRAM_PLACEHOLDER_COLORS[
        (itemIndex + REELS_COLOR_OFFSET) % INSTAGRAM_PLACEHOLDER_COLORS.length
      ],
    views: `${100 + ((itemIndex * 37) % 500)}K`,
  }));

export const INSTAGRAM_POSTS_TAB_DATA = createGridData(
  "posts",
  INSTAGRAM_ITEMS_PER_TAB,
);
export const INSTAGRAM_REELS_TAB_DATA = createReelData(
  INSTAGRAM_REELS_ITEMS_COUNT,
);
export const INSTAGRAM_TAGGED_TAB_DATA = createGridData(
  "tagged",
  INSTAGRAM_ITEMS_PER_TAB,
  TAGGED_COLOR_OFFSET,
);

export const instagramGridItemKeyExtractor = (item: InstagramGridItem) =>
  item.id;
export const instagramReelItemKeyExtractor = (item: InstagramReelItem) =>
  item.id;

export const getInstagramItemSpacingStyle = (itemIndex: number) => ({
  marginRight:
    itemIndex % INSTAGRAM_NUM_COLUMNS === INSTAGRAM_NUM_COLUMNS - 1
      ? 0
      : INSTAGRAM_GRID_GAP,
  marginBottom: INSTAGRAM_GRID_GAP,
});

const resolveInstagramTabIcon = (icon: unknown) =>
  typeof icon === "string" && icon in Ionicons.glyphMap
    ? (icon as keyof typeof Ionicons.glyphMap)
    : "ellipsis-horizontal";

type InstagramTopTabItemProps = TopTabItemRenderProps & {
  tabSlotWidth: number;
};

const InstagramTopTabItem = ({
  item,
  onPress,
  onLayout,
  tabSlotWidth,
}: InstagramTopTabItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      onLayout={(event) => onLayout(event as never)}
      style={[styles.igTabItem, { width: tabSlotWidth }]}
    >
      <Ionicons
        name={resolveInstagramTabIcon(item.icon)}
        size={24}
        color="#262626"
      />
    </Pressable>
  );
};

export const createInstagramTopTabsProps = (
  tabSlotWidth: number,
): TabViewTopTabsProps => ({
  backgroundColor: "#fff",
  containerStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#dbdbdb",
  },
  tabItemStyle: {
    paddingVertical: 10,
    width: tabSlotWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  renderTabItem: (props: TopTabItemRenderProps) => (
    <InstagramTopTabItem {...props} tabSlotWidth={tabSlotWidth} />
  ),
  indicatorColor: "#262626",
  indicatorHeight: 1.5,
  indicatorWidth: tabSlotWidth,
  indicatorPosition: "bottom",
  indicatorBorderRadius: 0,
  indicatorMarginBottom: 0,
  showIndicator: true,
});

export const useInstagramLayoutMetrics = () => {
  const { width } = useWindowDimensions();

  const imageSize = React.useMemo(
    () =>
      (width - INSTAGRAM_GRID_GAP * (INSTAGRAM_NUM_COLUMNS - 1)) /
      INSTAGRAM_NUM_COLUMNS,
    [width],
  );
  const reelHeight = React.useMemo(() => imageSize * 1.4, [imageSize]);
  const tabSlotWidth = React.useMemo(
    () => width / INSTAGRAM_TAB_COUNT,
    [width],
  );

  return { imageSize, reelHeight, tabSlotWidth };
};

type InstagramTileBaseProps = {
  itemIndex: number;
  color: string;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  isMeasurementPass?: boolean;
  children?: React.ReactNode;
};

const InstagramTileBase = ({
  itemIndex,
  color,
  width,
  height,
  style,
  isMeasurementPass = false,
  children,
}: InstagramTileBaseProps) => {
  return (
    <View
      style={[
        styles.gridItemBase,
        style,
        { width, height, backgroundColor: color },
      ]}
    >
      {!isMeasurementPass && (
        <>
          <Text style={styles.itemIndexText}>{itemIndex}</Text>
          {children}
        </>
      )}
    </View>
  );
};

type InstagramGridTileProps = {
  item: InstagramGridItem;
  itemIndex: number;
  imageSize: number;
  style?: StyleProp<ViewStyle>;
  isMeasurementPass?: boolean;
};

export const InstagramGridTile = React.memo(
  ({
    item,
    itemIndex,
    imageSize,
    style,
    isMeasurementPass,
  }: InstagramGridTileProps) => {
    return (
      <InstagramTileBase
        itemIndex={itemIndex}
        color={item.color}
        width={imageSize}
        height={imageSize}
        style={style}
        isMeasurementPass={isMeasurementPass}
      />
    );
  },
);

InstagramGridTile.displayName = "InstagramGridTile";

type InstagramReelTileProps = {
  item: InstagramReelItem;
  itemIndex: number;
  imageSize: number;
  reelHeight: number;
  style?: StyleProp<ViewStyle>;
  isMeasurementPass?: boolean;
};

export const InstagramReelTile = React.memo(
  ({
    item,
    itemIndex,
    imageSize,
    reelHeight,
    style,
    isMeasurementPass,
  }: InstagramReelTileProps) => {
    return (
      <InstagramTileBase
        itemIndex={itemIndex}
        color={item.color}
        width={imageSize}
        height={reelHeight}
        style={style}
        isMeasurementPass={isMeasurementPass}
      >
        <View style={styles.reelsOverlay}>
          <Ionicons name="play" size={12} color="#fff" />
          <Text style={styles.reelsViewCount}>{item.views}</Text>
        </View>
      </InstagramTileBase>
    );
  },
);

InstagramReelTile.displayName = "InstagramReelTile";

type InstagramTaggedTileProps = {
  item: InstagramGridItem;
  itemIndex: number;
  imageSize: number;
  style?: StyleProp<ViewStyle>;
  isMeasurementPass?: boolean;
};

export const InstagramTaggedTile = React.memo(
  ({
    item,
    itemIndex,
    imageSize,
    style,
    isMeasurementPass,
  }: InstagramTaggedTileProps) => {
    return (
      <InstagramTileBase
        itemIndex={itemIndex}
        color={item.color}
        width={imageSize}
        height={imageSize}
        style={style}
        isMeasurementPass={isMeasurementPass}
      >
        <View style={styles.taggedOverlay}>
          <Ionicons name="person" size={14} color="#fff" />
        </View>
      </InstagramTileBase>
    );
  },
);

InstagramTaggedTile.displayName = "InstagramTaggedTile";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 58,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#dbdbdb",
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerChevron: {
    marginLeft: 2,
  },
  headerUsername: {
    fontSize: 20,
    fontWeight: "700",
    color: "#262626",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionIcon: {
    marginRight: 20,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarContainer: {
    marginRight: 28,
  },
  avatarRing: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 2.5,
    borderColor: "#c13584",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#c7c7c7",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: "#262626",
  },
  statLabel: {
    fontSize: 13,
    color: "#262626",
    marginTop: 2,
  },
  bioSection: {
    marginBottom: 14,
  },
  displayName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#262626",
    marginBottom: 2,
  },
  bioCategory: {
    fontSize: 14,
    color: "#8e8e8e",
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: "#262626",
    lineHeight: 20,
  },
  bioLink: {
    fontSize: 14,
    color: "#00376b",
    fontWeight: "600",
    marginTop: 2,
  },
  highlightsRow: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 14,
  },
  highlightItem: {
    alignItems: "center",
    width: 64,
  },
  highlightCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: "#dbdbdb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    marginBottom: 4,
  },
  highlightNew: {
    borderStyle: "dashed",
  },
  highlightLabel: {
    fontSize: 12,
    color: "#262626",
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#efefef",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  actionButtonSmall: {
    width: 36,
    backgroundColor: "#efefef",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  igTabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  gridItemBase: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemIndexText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  reelsOverlay: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reelsViewCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  taggedOverlay: {
    position: "absolute",
    bottom: 6,
    left: 6,
  },
});
