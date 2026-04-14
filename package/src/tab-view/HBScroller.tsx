import * as React from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  View,
  ViewToken,
  ViewProps,
  StyleProp,
  ViewStyle,
  ViewabilityConfig,
  ListRenderItem,
  type FlatListProps,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSharedRefs } from "../internal/RefsContext";
import { TabItem, TabPageProps } from "./TopTabs";
import { getLeftOffset, getTabItemKey } from "../internal/utils";

export interface HBScrollerProps extends ViewProps {
  /** Array of tab items to render horizontally */
  tabs: TabItem[];
  /** Width of each tab page (default: screen width) */
  width?: number;
  /** Enable optimised viewable-item loading with getItemLayout (default: true) */
  enableLoadOnViewableItems?: boolean;
  /** Extra props forwarded to the inner horizontal FlatList */
  flatListProps?: Partial<FlatListProps<TabItem>>;
  /** Style applied to the outer container View */
  containerStyle?: StyleProp<ViewStyle>;
  /** How many tabs to render on the initial mount (default: 1) */
  initialNumToRender?: number;
  /** Snap alignment for paging (default: "center") */
  snapToAlignment?: "start" | "center" | "end";
  /** Deceleration rate after the user lifts their finger (default: "fast") */
  decelerationRate?: "normal" | "fast" | number;
  /** Prevent the scroll view from overshooting snap points (default: true) */
  disableIntervalMomentum?: boolean;
  /** Show the horizontal scroll indicator (default: false) */
  showsHorizontalScrollIndicator?: boolean;
  /** Viewability configuration for determining when a tab is "visible" */
  viewabilityConfig?: ViewabilityConfig;
  /** Callback fired when the visible tab changes – receives the new index */
  onActiveTabChange?: (index: number) => void;
  /** Initial tab index to display (default: 0) */
  initialTabIndex?: number;
}

const SCREEN_DIMENSIONS = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN_DIMENSIONS.width;
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.height;
const AnimatedFlatList = Animated.FlatList;

interface TabPageRendererProps extends Omit<TabPageProps, "isActive"> {
  activeTabIndex: SharedValue<number>;
}

const TabPageRenderer = React.memo(
  ({ item, index, width, activeTabIndex }: TabPageRendererProps) => {
    const { component: TabComponent } = item;
    const isActive = useDerivedValue(
      () => activeTabIndex.value === index,
      [activeTabIndex, index],
    );

    return (
      <TabComponent
        item={item}
        index={index}
        width={width}
        isActive={isActive}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.item === nextProps.item &&
    prevProps.index === nextProps.index &&
    prevProps.width === nextProps.width &&
    prevProps.activeTabIndex === nextProps.activeTabIndex,
);

const loadOnViewableItemsProps = (width: number) => ({
  getItemLayout: (
    _data: ArrayLike<TabItem> | null | undefined,
    index: number,
  ) => ({
    length: width,
    offset: width * index,
    index,
  }),
  windowSize: 5,
  // React Native expects this to be at least 1; 0 can produce an invalid
  // render window (`last: -1`) before layout metrics settle.
  maxToRenderPerBatch: 1,
  removeClippedSubviews: false,
});

const HBScroller: React.FC<HBScrollerProps> = ({
  tabs,
  width = SCREEN_WIDTH,
  enableLoadOnViewableItems = true,
  flatListProps = {},
  containerStyle,
  initialNumToRender = 1,
  snapToAlignment = "center",
  decelerationRate = "fast",
  disableIntervalMomentum = true,
  showsHorizontalScrollIndicator = false,
  viewabilityConfig = { itemVisiblePercentThreshold: 98 },
  onActiveTabChange,
  initialTabIndex = 0,
  ...rest
}) => {
  const {
    scrollEventThrottle: flatListScrollEventThrottle = 16,
    onScroll: flatListOnScroll,
    ...restFlatListProps
  } = flatListProps;
  const {
    resetPreviousScrollingY,
    minTabContentHeight,
    tabViewContainerHeight,
    hParentScroller,
    currentTab,
    currentTabIndex,
    currentScrollingYValue,
    topSectionHeight,
    tabScrollingDetails,
    vParentScroller,
    tabContentSize,
    goToTabIndex,
    setActiveTabScrollYOffset,
    setGoToTabIndex,
    setCurrentTab,
    setHorizontalScrollXShared,
    setPendingTabSwitchOffset,
    setTabScrollOffset,
    setTabViewContainerHeight,
    setTopSectionListProgressShared,
    onTabChange,
    vChildScrollToOffset,
    topTabItemsLayoutValue,
    indicatorWidthValue,
    deleteTabScrollOffset,
  } = useSharedRefs();

  const handleExternalScroll = React.useCallback(
    (e: any) => {
      flatListOnScroll?.(e);
    },
    [flatListOnScroll],
  );

  const _onLayout = (_e: LayoutChangeEvent) => {
    // this code will execute when layout is updates to ensure the scroll position is saved
    // the delay to ensure the snap interval is updated
    // reserved for updating layout
    setTimeout(() => {
      hParentScroller.current?.scrollToIndex({
        index: currentTab.current,
        animated: false,
      });
    }, 10);
    // The rest of this handler is only for "save scroll position" mode.
    // In reset mode, forcing parent scroll on every layout change causes
    // active-tab jumps while the user is scrolling.
    if (resetPreviousScrollingY) {
      return;
    }

    // this code is for the case
    // 2. the new layout is bigger than the old one
    // we will execute the scroll after the layout is ready
    // but we allowed it in both cases because we will not affect the scroll position because it remains the same in the 1 case

    // get the scroll offset
    const currentScrollOffset = tabScrollingDetails.current.get(
      currentTab.current,
    );

    if (currentScrollOffset?.offset === undefined) {
      return;
    }

    if (topSectionHeight.value <= currentScrollingYValue?.value) {
      vParentScroller.current?.scrollTo({
        x: 0,
        y: currentScrollOffset.offset,
        animated: false,
      });

      deleteTabScrollOffset(currentTab.current);
    }
  };

  const _onViewableItemsChanged = (e: {
    viewableItems: ViewToken<TabItem>[];
    changed: ViewToken<TabItem>[];
  }) => {
    const changedIndex = e.changed?.[0]?.index;
    const changedIsViewable = e.changed?.[0]?.isViewable;

    if (changedIsViewable) {
      // Skip intermediate tabs during a programmatic jump (e.g., tab 0 → tab 2)
      // When goToTabIndex is set, only process the target tab
      const newVisibleIndex = changedIndex;
      if (
        goToTabIndex.current !== -1 &&
        newVisibleIndex !== undefined &&
        goToTabIndex.current !== newVisibleIndex
      ) {
        return;
      }

      const nextTabIndex =
        goToTabIndex.current !== -1
          ? goToTabIndex.current
          : (e.viewableItems[0]?.index ?? newVisibleIndex);

      if (nextTabIndex == null) {
        return;
      }

      // Ignore duplicate "current tab is viewable" callbacks.
      // These can happen during layout/content-size updates and must not
      // trigger tab-switch scroll reset logic.
      if (goToTabIndex.current === -1 && nextTabIndex === currentTab.current) {
        return;
      }

      const previousActiveTabIndex = currentTab.current;

      // update the current tab state
      if (goToTabIndex.current === -1) {
        onTabChange(nextTabIndex, true);
        onActiveTabChange?.(nextTabIndex);
      } else if (goToTabIndex.current == e.changed?.[0]?.index) {
        // rest the current tab when the user reach the tab index
        setGoToTabIndex(-1);
      }
      // save the old scrolling details
      if (
        currentScrollingYValue.value > topSectionHeight.value &&
        !resetPreviousScrollingY
      ) {
        setTabScrollOffset(
          previousActiveTabIndex,
          currentScrollingYValue.value,
        );
      } else {
        // tabScrollingDetails.current.delete(currentTab.current);
      }
      // get the old previews tab content height
      const previewsTabHeight =
        tabContentSize.current.get(previousActiveTabIndex) || 0;
      const previousContainerHeight = Math.max(
        previewsTabHeight,
        minTabContentHeight.current,
      );
      // update the current tab index
      // get the next tab content height
      const currentTabHeight = tabContentSize.current.get(nextTabIndex) || 0;
      const nextContainerHeight = Math.max(
        currentTabHeight,
        minTabContentHeight.current,
      );

      // update the view size for the next tab content height
      setTabViewContainerHeight(nextContainerHeight);

      // top section height
      // rest the current saved scrolling details
      // get the scroll offset
      const currentScrollOffset = tabScrollingDetails.current.get(nextTabIndex);
      const savedOffset = currentScrollOffset?.offset;

      // If the current parent scroll is still in the header area, keep the
      // existing header position unless the destination tab already has a
      // saved offset. Saved tab offsets must be restored independently of the
      // current header-collapse state.
      if (
        currentScrollingYValue.value < topSectionHeight.value &&
        (resetPreviousScrollingY || savedOffset === undefined)
      ) {
        setCurrentTab(nextTabIndex);
        setActiveTabScrollYOffset(0);
        return;
      }

      const targetParentOffset =
        resetPreviousScrollingY || savedOffset === undefined
          ? topSectionHeight.value
          : savedOffset;
      const targetChildOffset = Math.max(
        targetParentOffset - topSectionHeight.value,
        0,
      );

      setPendingTabSwitchOffset(nextTabIndex, targetChildOffset);
      setCurrentTab(nextTabIndex);
      setActiveTabScrollYOffset(targetChildOffset);

      // When resetPreviousScrollingY is enabled, always scroll the parent
      // to topSectionHeight and reset the new tab's child scroll to 0.
      // This must happen immediately to prevent ScrollerContainer._onScroll
      // from syncing the new tab's child to the old parent Y offset.
      if (resetPreviousScrollingY) {
        if (previousActiveTabIndex !== nextTabIndex) {
          vChildScrollToOffset(0, previousActiveTabIndex, true);
        }
        vChildScrollToOffset(0, nextTabIndex, true);
        vParentScroller.current?.scrollTo({
          x: 0,
          y: targetParentOffset,
          animated: false,
        });
        deleteTabScrollOffset(nextTabIndex);
        return;
      }

      // In keep-position mode, tabs without a saved offset should start from the
      // tab's initial state (top of tab content), not from the previous tab offset.
      if (savedOffset === undefined) {
        vChildScrollToOffset(0, nextTabIndex);
        vParentScroller.current?.scrollTo({
          x: 0,
          y: targetParentOffset,
          animated: false,
        });
        deleteTabScrollOffset(nextTabIndex);
        return;
      }

      // scroll to the saved offset (only for saveScrollPosition mode)
      // Restore immediately when the effective container height does not grow.
      // If it grows, the parent may clamp to the old max offset until layout updates.
      if (nextContainerHeight <= previousContainerHeight) {
        if (topSectionHeight.value <= currentScrollingYValue?.value) {
          vParentScroller.current?.scrollTo({
            x: 0,
            y: targetParentOffset,
            animated: false,
          });

          deleteTabScrollOffset(nextTabIndex);
        }
      }
    }
  };

  const horizontalScrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        const offsetX = e.contentOffset.x;
        setHorizontalScrollXShared(offsetX);

        const progress = width === 0 ? 0 : offsetX / width;
        const currentIndex = Math.max(Math.floor(progress), 0);
        const progressPercentage = progress - currentIndex;
        const offset = getLeftOffset(
          currentIndex,
          topTabItemsLayoutValue.value,
          indicatorWidthValue.value,
          progressPercentage,
        );

        setTopSectionListProgressShared(offset);

        if (flatListOnScroll) {
          scheduleOnRN(handleExternalScroll, e);
        }
      },
    },
    [
      flatListOnScroll,
      handleExternalScroll,
      indicatorWidthValue,
      setHorizontalScrollXShared,
      setTopSectionListProgressShared,
      topTabItemsLayoutValue,
      width,
    ],
  );

  // scroll to initialTabIndex on first mount
  React.useEffect(() => {
    if (initialTabIndex > 0) {
      setCurrentTab(initialTabIndex);
      setTimeout(() => {
        hParentScroller.current?.scrollToIndex({
          index: initialTabIndex,
          animated: false,
        });
      }, 10);
    }
  }, [hParentScroller, initialTabIndex, setCurrentTab]);

  const renderTabPage = React.useCallback<ListRenderItem<TabItem>>(
    ({ item, index }) => {
      return (
        <View style={{ width }}>
          <TabPageRenderer
            item={item}
            index={index}
            width={width}
            activeTabIndex={currentTabIndex}
          />
        </View>
      );
    },
    [currentTabIndex, width],
  );

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: tabViewContainerHeight.value || undefined,
    };
  });

  return (
    <Animated.View
      {...rest}
      onLayout={_onLayout}
      style={[{ flex: 1 }, containerStyle, animatedContainerStyle]}
    >
      {/** horizontal flatList */}
      {React.createElement(AnimatedFlatList as any, {
        ref: hParentScroller,
        style: {
          // this is just initial value
          maxHeight: SCREEN_HEIGHT,
        },
        data: tabs,
        initialNumToRender: Math.max(initialNumToRender, initialTabIndex + 1),
        initialScrollIndex: initialTabIndex > 0 ? initialTabIndex : undefined,
        snapToInterval: width,
        snapToAlignment,
        decelerationRate,
        onViewableItemsChanged: _onViewableItemsChanged,
        disableIntervalMomentum,
        ...(enableLoadOnViewableItems ? loadOnViewableItemsProps(width) : {}),
        showsHorizontalScrollIndicator,
        viewabilityConfig,
        horizontal: true,
        keyExtractor: (item: TabItem, index: number) =>
          getTabItemKey(item, index),
        onScroll: horizontalScrollHandler,
        scrollEventThrottle: flatListScrollEventThrottle,
        renderItem: renderTabPage,
        windowSize: 5,
        ...restFlatListProps,
      })}
    </Animated.View>
  );
};

export default HBScroller;
