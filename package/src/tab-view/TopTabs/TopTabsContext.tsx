import React, { createContext, useContext, RefObject } from "react";
import { LayoutRectangle, StyleProp, ViewStyle, TextStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

/**
 * Style configuration for TopTabs and its children.
 * Passed from TopTabs props down through context.
 */
export interface TopTabsStyleConfig {
  /** Width of the tab bar container (default: screen width) */
  width: number;

  // ─── Tab Item Styling ───────────────────────────────────────────────

  /** Style applied to each tab item's animated container */
  tabItemStyle?: StyleProp<ViewStyle>;
  /** Style applied to each tab item's text label */
  tabTextStyle?: StyleProp<TextStyle>;
  /** Background color when the tab is active (default: 'rgba(255,0,0,1)') */
  activeColor?: string;
  /** Background color when the tab is inactive (default: 'rgba(255,0,0,0)') */
  inactiveColor?: string;
  /** Opacity when the tab is fully active (default: 1) */
  activeOpacity?: number;
  /** Opacity when the tab is fully inactive (default: 0.5) */
  inactiveOpacity?: number;

  // ─── Indicator Styling ──────────────────────────────────────────────

  /** Style applied to the indicator view */
  indicatorStyle?: StyleProp<ViewStyle>;
  /** Width of the indicator bar (default: 50) */
  indicatorWidth?: number;
  /** Height of the indicator bar (default: 4) */
  indicatorHeight?: number;
  /** Background color of the indicator (default: 'white') */
  indicatorColor?: string;
  /** Whether to show the indicator (default: true) */
  showIndicator?: boolean;
  /** Border radius of the indicator (default: 0) */
  indicatorBorderRadius?: number;
  /** Opacity of the indicator (0–1, default: 1) */
  indicatorOpacity?: number;
  /** Position of the indicator relative to tab items ('top' | 'bottom', default: 'bottom') */
  indicatorPosition?: "top" | "bottom";
  /** Horizontal alignment of the indicator within each tab item ('left' | 'center' | 'right', default: 'center') */
  indicatorAlign?: "left" | "center" | "right";
  /** Top margin of the indicator */
  indicatorMarginTop?: number;
  /** Bottom margin of the indicator */
  indicatorMarginBottom?: number;
  /** Horizontal margin of the indicator */
  indicatorMarginHorizontal?: number;
  /** Disable the Reanimated layout transition animation on the indicator */
  indicatorDisableLayoutTransition?: boolean;
}

/**
 * Inner context for TopTabs — shared between TopTabs, TopTabItem, and TopTabIndicator.
 *
 * This decouples children from the global RefsContext. TopTabs creates this
 * context by bridging the global shared refs it needs + style config from props.
 */
export interface TopTabsContextType {
  // ─── Refs bridged from the parent system ────────────────────────────

  /** Layout map for each tab item (keyed by index) */
  topTabItemsLayout: RefObject<Map<number, LayoutRectangle>>;
  /** Shared animated value storing the indicator's absolute X position */
  topSectionListProgress: SharedValue<number>;
  /** Shared animated value of the top tabs header horizontal scroll offset */
  headerOffsetScrollValue: SharedValue<number>;
  /** Ref holding the current indicator element width */
  indicatorWidthRef: RefObject<number>;
  /** Ref holding the current active tab index */
  currentTab: RefObject<number>;
  /** Shared animated value of horizontal scroll offset (from HBScroller) */
  hActiveScrollingX: SharedValue<number>;

  // ─── Callbacks ──────────────────────────────────────────────────────

  /** Called when a tab is pressed — handles both HBScroller scroll + header centering */
  onTabPress: (index: number) => void;
  /** Called when a tab item layout is measured */
  onTabItemLayout: (index: number, layout: LayoutRectangle) => void;
  /** Called when indicator layout is measured; updates indicator width and x offset */
  onIndicatorLayout: (layoutWidth: number) => void;

  // ─── Style configuration ────────────────────────────────────────────

  /** Merged style config from TopTabs props */
  config: TopTabsStyleConfig;
}

const TopTabsContext = createContext<TopTabsContextType | null>(null);

export const TopTabsProvider = TopTabsContext.Provider;

/**
 * Hook to access the inner TopTabs context.
 * Must be used inside a TopTabs component (which provides the context).
 * Useful for building custom tab items or indicators.
 */
export const useTopTabsContext = (): TopTabsContextType => {
  const context = useContext(TopTabsContext);
  if (!context) {
    throw new Error(
      "useTopTabsContext must be used within a TopTabs component",
    );
  }
  return context;
};
