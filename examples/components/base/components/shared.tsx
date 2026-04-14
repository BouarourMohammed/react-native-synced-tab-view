import * as React from "react";
import {
  FlashList as RNFlashList,
  type FlashListProps as RNFlashListProps,
} from "@shopify/flash-list";
import { Dimensions, StyleSheet } from "react-native";
import {
  createSyncedTabScrollComponent,
  type TabPageProps,
  type TabViewTopTabsProps,
} from "react-native-synced-tab-view";

export const HEADER_SPACER_STYLE = { width: 32 };
export const LIST_CONTENT_CONTAINER_STYLE = {
  paddingHorizontal: 16,
  paddingVertical: 8,
};
export const SECTION_LIST_CONTENT_CONTAINER_STYLE = {
  paddingTop: 8,
};
export const SECTION_LIST_ITEM_HEIGHT = 80;
export const HORIZONTAL_ITEM_SIZE = 80;
export const STACKED_ITEM_HEIGHT = 80;
export const SIMULATED_API_DELAY_MS = 2000;
export const FEED_PAGE_SIZE = 12;
export const FEED_TOTAL_PAGES = 5;
export const NUM_COLUMNS = 3;

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_GAP = 2;
const IMAGE_SIZE = (SCREEN_WIDTH - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export const COLORS = [
  "#6C5CE7",
  "#00B894",
  "#FDCB6E",
  "#E17055",
  "#74B9FF",
  "#A29BFE",
  "#55EFC4",
  "#FAB1A0",
  "#81ECEC",
  "#DFE6E9",
];

export const BASE_TOP_TABS_PROPS = {
  backgroundColor: "#fff",
  tabItemStyle: { paddingVertical: 12, paddingHorizontal: 20 },
  tabTextStyle: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  activeColor: "transparent",
  inactiveColor: "transparent",
  indicatorColor: "#6C5CE7",
  indicatorHeight: 3,
  indicatorBorderRadius: 1.5,
  indicatorPosition: "bottom" as const,
  showIndicator: true,
  containerStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
} satisfies TabViewTopTabsProps;

export type BaseTabPageProps = Pick<TabPageProps, "index" | "width">;

type SyncedFlashListProps<T> = RNFlashListProps<T> & {
  index: number;
  width?: number;
};

type SyncedFlashListRef = React.ComponentRef<typeof RNFlashList>;

const InternalSyncedFlashList = createSyncedTabScrollComponent<
  RNFlashListProps<any>,
  SyncedFlashListRef
>(RNFlashList as unknown as React.ComponentType<any>);

type SyncedFlashListComponent = <T>(
  props: SyncedFlashListProps<T> & React.RefAttributes<SyncedFlashListRef>,
) => React.ReactElement | null;

const SyncedFlashListInner = <T,>(
  props: SyncedFlashListProps<T>,
  ref: React.ForwardedRef<SyncedFlashListRef>,
) => {
  return <InternalSyncedFlashList {...(props as any)} ref={ref} />;
};

const ForwardedSyncedFlashList = React.forwardRef(SyncedFlashListInner);
ForwardedSyncedFlashList.displayName = "BaseExampleSyncedFlashList";

export const SyncedFlashList =
  ForwardedSyncedFlashList as SyncedFlashListComponent;

export const getGridItemSpacingStyle = (itemIndex: number) => ({
  marginRight: itemIndex % NUM_COLUMNS === NUM_COLUMNS - 1 ? 0 : GRID_GAP,
  marginBottom: GRID_GAP,
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 58,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  topSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fff",
    alignItems: "stretch",
    gap: 14,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  topSubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  detailsToggleButton: {
    width: "100%",
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: "#eef0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsToggleButtonPressed: {
    opacity: 0.9,
  },
  detailsToggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5a52cc",
  },
  extraContent: {
    gap: 10,
    width: "100%",
  },
  extraCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#fafafe",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ececf3",
    padding: 14,
  },
  extraCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  extraCardBody: {
    flex: 1,
    gap: 4,
  },
  extraCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  extraCardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#777",
  },

  feedInitialState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 36,
    gap: 10,
  },
  feedInitialTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d2d34",
    textAlign: "center",
  },
  feedInitialSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#7a7a85",
    textAlign: "center",
  },
  feedCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ececf3",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  feedCardAccent: {
    width: 12,
    height: 46,
    borderRadius: 999,
  },
  feedCardBody: {
    flex: 1,
    gap: 4,
  },
  feedCategory: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6C5CE7",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  feedCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  feedCardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#777",
  },
  feedFooter: {
    paddingTop: 10,
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  feedFooterSpacer: {
    height: 12,
  },
  feedFooterText: {
    fontSize: 13,
    color: "#666672",
  },
  feedFooterDoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6C5CE7",
  },

  gridItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  gridItemText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 14,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: "#999",
  },

  sectionListHeader: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionListHeaderAccent: {
    width: 10,
    height: 28,
    borderRadius: 999,
  },
  sectionListHeaderCopy: {
    flex: 1,
  },
  sectionListHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  sectionListHeaderSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  sectionListItem: {
    marginHorizontal: 16,
    marginBottom: 8,
    minHeight: SECTION_LIST_ITEM_HEIGHT,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ececf3",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionListItemAccent: {
    width: 12,
    height: 48,
    borderRadius: 999,
  },
  sectionListItemContent: {
    flex: 1,
  },
  sectionListItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sectionListItemSubtitle: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
  },

  scrollerTabInner: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  scrollerTabTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  horizontalScrollerListContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  horizontalScrollerList: {
    width: "100%",
    height: HORIZONTAL_ITEM_SIZE,
  },
  horizontalScrollerSeparator: {
    marginRight: 12,
  },
  horizontalScrollerItem: {
    width: HORIZONTAL_ITEM_SIZE,
    height: HORIZONTAL_ITEM_SIZE,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalScrollerItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  stackedScrollerList: {
    gap: 12,
  },
  stackedScrollerItem: {
    width: "100%",
    height: STACKED_ITEM_HEIGHT,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9e9ef",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stackedScrollerItemAccent: {
    width: 12,
    height: 48,
    borderRadius: 999,
  },
  stackedScrollerItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  shortTabCard: {
    height: 200,
    width: "100%",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  shortTabTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  shortTabSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#777",
    textAlign: "center",
  },
});
