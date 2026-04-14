import React from "react";
import {
  View,
  Dimensions,
  ViewProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  ScrollViewProps,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSharedRefs } from "../../internal/RefsContext";
import TopTabItem from "./TopTabItem";
import TopTabIndicator from "./TopTabIndicator";
import { getLeftOffset, getTabItemKey } from "../../internal/utils";
import { TopTabsProvider, TopTabsStyleConfig } from "./TopTabsContext";

// ─── Public Types ───────────────────────────────────────────────────────────

export interface TabItem {
  /** Stable identity used for React keys and pager state when tabs reorder */
  key?: string | number;
  /** Alternative stable identity used when `key` is not provided */
  id?: string | number;
  name: string;
  component: (props: TabPageProps) => React.ReactNode;
  [key: string]: unknown;
}

export interface TabPageProps {
  item: TabItem;
  index: number;
  width?: number;
  isActive: SharedValue<boolean>;
}

/** Props handed to a custom `renderTabItem` function */
export interface TopTabItemRenderProps {
  item: TabItem;
  index: number;
  title: string;
  isActive: SharedValue<boolean>;
  /** Call this to trigger tab navigation */
  onPress: () => void;
  /** Attach this to the item's root so the indicator knows the layout */
  onLayout: (e: LayoutChangeEvent) => void;
}

interface CustomTopTabItemProps {
  item: TabItem;
  index: number;
  title: string;
  activeTabIndex: SharedValue<number>;
  renderTabItem: (props: TopTabItemRenderProps) => React.ReactElement;
  onTabPress: (index: number) => void;
  onTabItemLayout: (
    index: number,
    layout: LayoutChangeEvent["nativeEvent"]["layout"],
  ) => void;
}

const CustomTopTabItem = React.memo(
  ({
    item,
    index,
    title,
    activeTabIndex,
    renderTabItem,
    onTabPress,
    onTabItemLayout,
  }: CustomTopTabItemProps) => {
    const isActive = useDerivedValue(
      () => activeTabIndex.value === index,
      [activeTabIndex, index],
    );

    const handlePress = React.useCallback(() => {
      onTabPress(index);
    }, [index, onTabPress]);

    const handleLayout = React.useCallback(
      (e: LayoutChangeEvent) => {
        onTabItemLayout(index, e.nativeEvent.layout);
      },
      [index, onTabItemLayout],
    );

    return renderTabItem({
      item,
      index,
      title,
      isActive,
      onPress: handlePress,
      onLayout: handleLayout,
    });
  },
  (prevProps, nextProps) =>
    prevProps.item === nextProps.item &&
    prevProps.index === nextProps.index &&
    prevProps.title === nextProps.title &&
    prevProps.activeTabIndex === nextProps.activeTabIndex &&
    prevProps.renderTabItem === nextProps.renderTabItem &&
    prevProps.onTabPress === nextProps.onTabPress &&
    prevProps.onTabItemLayout === nextProps.onTabItemLayout,
);

// ─── TopTabs Props ──────────────────────────────────────────────────────────

export interface TopTabsProps extends ViewProps {
  tabs: TabItem[];
  width?: number;

  // Container ──────────────────────────────────────────────────────────
  /** Extra style merged on top of the outer container */
  containerStyle?: StyleProp<ViewStyle>;
  /** Background color of the tab bar */
  backgroundColor?: string;

  // ScrollView ─────────────────────────────────────────────────────────
  /** Extra style for the horizontal ScrollView */
  scrollViewStyle?: StyleProp<ViewStyle>;
  /** Additional ScrollView props (decelerationRate, bounces, …) */
  scrollViewProps?: Partial<ScrollViewProps>;

  // Tab Item ───────────────────────────────────────────────────────────
  /** Style applied to every tab item's animated wrapper */
  tabItemStyle?: StyleProp<ViewStyle>;
  /** Style applied to every tab item's text label */
  tabTextStyle?: StyleProp<TextStyle>;
  /** Background color when a tab is active */
  activeColor?: string;
  /** Background color when a tab is inactive */
  inactiveColor?: string;
  /** Opacity when a tab is fully active (default 1) */
  activeOpacity?: number;
  /** Opacity when a tab is fully inactive (default 0.5) */
  inactiveOpacity?: number;
  /** Fully custom tab‑item renderer (receives helpers for onPress/onLayout) */
  renderTabItem?: (props: TopTabItemRenderProps) => React.ReactElement;

  // Indicator ──────────────────────────────────────────────────────────
  /** Extra style merged onto the indicator view */
  indicatorStyle?: StyleProp<ViewStyle>;
  /** Indicator width (default 50) */
  indicatorWidth?: number;
  /** Indicator height (default 4) */
  indicatorHeight?: number;
  /** Indicator color (default 'white') */
  indicatorColor?: string;
  /** Set false to hide the indicator entirely */
  showIndicator?: boolean;
  /** Border radius of the indicator (default 0) */
  indicatorBorderRadius?: number;
  /** Opacity of the indicator (0–1, default 1) */
  indicatorOpacity?: number;
  /** Position of the indicator relative to tab items ('top' | 'bottom', default 'bottom') */
  indicatorPosition?: "top" | "bottom";
  /** Horizontal alignment of the indicator within each tab item ('left' | 'center' | 'right', default 'center') */
  indicatorAlign?: "left" | "center" | "right";
  /** Top margin of the indicator */
  indicatorMarginTop?: number;
  /** Bottom margin of the indicator */
  indicatorMarginBottom?: number;
  /** Horizontal margin of the indicator */
  indicatorMarginHorizontal?: number;
  /** Disable the Reanimated layout transition animation on the indicator */
  indicatorDisableLayoutTransition?: boolean;
  /** Fully custom indicator renderer */
  renderIndicator?: () => React.ReactElement;
}

// ─── Component ──────────────────────────────────────────────────────────────

const TopTabs: React.FC<TopTabsProps> = ({
  width: widthProp,
  tabs,
  // Container
  containerStyle,
  backgroundColor,
  // ScrollView
  scrollViewStyle,
  scrollViewProps,
  // Tab item customisation
  tabItemStyle,
  tabTextStyle,
  activeColor,
  inactiveColor,
  activeOpacity,
  inactiveOpacity,
  renderTabItem,
  // Indicator customisation
  indicatorStyle,
  indicatorWidth: indicatorWidthProp,
  indicatorHeight,
  indicatorColor,
  showIndicator = true,
  indicatorBorderRadius,
  indicatorOpacity,
  indicatorPosition,
  indicatorAlign,
  indicatorMarginTop,
  indicatorMarginBottom,
  indicatorMarginHorizontal,
  indicatorDisableLayoutTransition,
  renderIndicator,
  // ViewProps
  onLayout,
  ...rest
}) => {
  const width = widthProp || Dimensions.get("screen").width;

  // ── bridge from global shared‑refs context ──────────────────────────
  const {
    topTabItemsLayout,
    topSectionListProgress,
    topTabScrollerRef,
    currentTab,
    currentTabIndex,
    indicatorWidth,
    hActiveScrollingX,
    headerOffsetScrollValue,
    setGoToTabIndex,
    setHeaderOffsetScrollShared,
    setTopTabLayout,
    setIndicatorWidth,
    setTopSectionListProgress,
    setTopTabItemLayout,
    onTabChange,
  } = useSharedRefs();

  // ── tab press handler (sets goToTabIndex then delegates to onTabChange) ──
  const handleTabPress = React.useCallback((index: number) => {
    setGoToTabIndex(index);
    onTabChange(index);
  }, [onTabChange, setGoToTabIndex]);

  const handleExternalScroll = React.useCallback((e: any) => {
    scrollViewProps?.onScroll?.(e);
  }, [scrollViewProps]);

  const syncIndicatorProgress = React.useCallback((
    tabIndex: number,
    layoutWidth: number,
  ) => {
    if (!topTabItemsLayout.current.has(tabIndex)) return;

    const nextProgress = getLeftOffset(
      tabIndex,
      topTabItemsLayout.current,
      layoutWidth,
    );
    setTopSectionListProgress(nextProgress);
  }, [setTopSectionListProgress, topTabItemsLayout]);

  const handleTabItemLayout = React.useCallback((
    index: number,
    layout: LayoutChangeEvent["nativeEvent"]["layout"],
  ) => {
    setTopTabItemLayout(index, layout);

    // If tab layout arrives after indicator layout, sync to the current tab.
    if (index === currentTab.current && indicatorWidth.current > 0) {
      syncIndicatorProgress(currentTab.current, indicatorWidth.current);
    }
  }, [
    currentTab,
    indicatorWidth,
    setTopTabItemLayout,
    syncIndicatorProgress,
  ]);

  const handleIndicatorLayout = React.useCallback((layoutWidth: number) => {
    // Always persist measured width so HBScroller math stays in sync.
    setIndicatorWidth(layoutWidth);
    syncIndicatorProgress(currentTab.current, layoutWidth);
  }, [currentTab, setIndicatorWidth, syncIndicatorProgress]);

  const topTabsScrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        const offsetX = e.contentOffset.x;
        setHeaderOffsetScrollShared(offsetX);

        if (scrollViewProps?.onScroll) {
          scheduleOnRN(handleExternalScroll, e);
        }
      },
    },
    [scrollViewProps, handleExternalScroll, setHeaderOffsetScrollShared],
  );

  // ── build style config that children read via context ───────────────
  const config = React.useMemo<TopTabsStyleConfig>(
    () => ({
      width,
      tabItemStyle,
      tabTextStyle,
      activeColor,
      inactiveColor,
      activeOpacity,
      inactiveOpacity,
      indicatorStyle,
      indicatorWidth: indicatorWidthProp,
      indicatorHeight,
      indicatorColor,
      showIndicator,
      indicatorBorderRadius,
      indicatorOpacity,
      indicatorPosition,
      indicatorAlign,
      indicatorMarginTop,
      indicatorMarginBottom,
      indicatorMarginHorizontal,
      indicatorDisableLayoutTransition,
    }),
    [
      activeColor,
      activeOpacity,
      inactiveColor,
      inactiveOpacity,
      indicatorAlign,
      indicatorBorderRadius,
      indicatorColor,
      indicatorDisableLayoutTransition,
      indicatorHeight,
      indicatorMarginBottom,
      indicatorMarginHorizontal,
      indicatorMarginTop,
      indicatorOpacity,
      indicatorPosition,
      indicatorStyle,
      indicatorWidthProp,
      showIndicator,
      tabItemStyle,
      tabTextStyle,
      width,
    ],
  );

  const contextValue = React.useMemo(
    () => ({
      topTabItemsLayout,
      topSectionListProgress,
      headerOffsetScrollValue,
      indicatorWidthRef: indicatorWidth,
      currentTab,
      hActiveScrollingX,
      onTabPress: handleTabPress,
      onTabItemLayout: handleTabItemLayout,
      onIndicatorLayout: handleIndicatorLayout,
      config,
    }),
    [
      config,
      currentTab,
      headerOffsetScrollValue,
      hActiveScrollingX,
      handleIndicatorLayout,
      handleTabItemLayout,
      handleTabPress,
      indicatorWidth,
      topSectionListProgress,
      topTabItemsLayout,
    ],
  );

  return (
    <TopTabsProvider value={contextValue}>
      <View
        {...rest}
        onLayout={(e) => {
          setTopTabLayout(e.nativeEvent.layout);
          onLayout?.(e);
        }}
        style={[
          {
            maxWidth: width,
            overflow: "hidden" as const,
          },
          backgroundColor ? { backgroundColor } : undefined,
          containerStyle,
        ]}
      >
        <Animated.ScrollView
          ref={topTabScrollerRef as any}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          horizontal
          {...scrollViewProps}
          style={[{ width: "100%" }, scrollViewStyle, scrollViewProps?.style]}
          onScroll={topTabsScrollHandler}
        >
          {tabs.map((item, index) =>
            renderTabItem ? (
              <CustomTopTabItem
                key={getTabItemKey(item, index)}
                item={item}
                index={index}
                title={item.name}
                activeTabIndex={currentTabIndex}
                renderTabItem={renderTabItem}
                onTabPress={handleTabPress}
                onTabItemLayout={handleTabItemLayout}
              />
            ) : (
              <TopTabItem
                key={getTabItemKey(item, index)}
                index={index}
                title={item.name}
              />
            ),
          )}
        </Animated.ScrollView>

        {showIndicator &&
          (renderIndicator ? renderIndicator() : <TopTabIndicator />)}
      </View>
    </TopTabsProvider>
  );
};

export default TopTabs;

// Re‑export the context hook so consumers can build custom items / indicators
export { useTopTabsContext } from "./TopTabsContext";
export type { TopTabsStyleConfig, TopTabsContextType } from "./TopTabsContext";
