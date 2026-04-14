import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import {
  FlatList,
  SectionList,
  type LayoutRectangle,
  ScrollView,
} from "react-native";
import {
  cancelAnimation,
  type SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  getLeftOffset,
  serializeTopTabLayouts,
  type TabLayoutMetrics,
} from "./utils";

// Define types for the refs
type ScrollableChild = ScrollView | FlatList | SectionList<any>;

type SharedRefs = {
  resetPreviousScrollingY: boolean;
  minTabContentHeight: RefObject<number>;
  vParentScroller: RefObject<ScrollView | null>;
  hParentScroller: RefObject<FlatList | null>;
  currentTab: RefObject<number>;
  currentTabIndex: SharedValue<number>;
  tabContentSize: RefObject<Map<number, number>>;
  currentScrollingYValue: SharedValue<number>;
  topSectionLayout: RefObject<LayoutRectangle | undefined>;
  topSectionHeight: SharedValue<number>;
  tabViewContainerHeight: SharedValue<number>;
  activeTabScrollYOffsetValue: SharedValue<number>;
  pendingTabSwitchIndexValue: SharedValue<number>;
  pendingTabSwitchOffsetValue: SharedValue<number>;
  topTabScrollerRef: RefObject<ScrollView | null>;
  topSectionListProgress: SharedValue<number>;
  hActiveScrollingX: SharedValue<number>;
  indicatorWidth: RefObject<number>;
  indicatorWidthValue: SharedValue<number>;
  topTabItemsLayout: RefObject<Map<number, LayoutRectangle>>;
  topTabItemsLayoutValue: SharedValue<TabLayoutMetrics>;
  tabScrollingDetails: RefObject<Map<number, { offset: number }>>;
  headerOffsetScrollValue: SharedValue<number>;
  goToTabIndex: RefObject<number>;
  setActiveTabScrollYOffset: (offset: number) => void;
  setActiveTabScrollYOffsetShared: (offset: number) => void;
  setGoToTabIndex: (index: number) => void;
  setCurrentTab: (index: number) => void;
  setHorizontalScrollXShared: (offset: number) => void;
  setTopSectionListProgress: (value: number) => void;
  setTopSectionListProgressShared: (value: number) => void;
  setTopTabLayout: (layout: LayoutRectangle) => void;
  setHeaderOffsetScrollShared: (offset: number) => void;
  setIndicatorWidth: (width: number) => void;
  setTopTabItemLayout: (index: number, layout: LayoutRectangle) => void;
  setVChildScrollRef: (index: number, ref: ScrollableChild | null) => void;
  setTabContentHeight: (index: number, height: number) => void;
  setCurrentScrollingYShared: (offset: number) => void;
  setScrollerContainerHeight: (height: number) => void;
  setTabViewContainerHeight: (height: number) => void;
  setPendingTabSwitchOffset: (index: number, offset: number) => void;
  clearPendingTabSwitch: () => void;
  deleteTabScrollOffset: (index: number) => void;
  setTabScrollOffset: (index: number, offset: number) => void;
  setTopSectionLayout: (layout: LayoutRectangle) => void;
  adjustTabScrollOffsets: (delta: number) => void;
  onTabChange: (index: number, isScrolling?: boolean) => void;
  vChildScrollToOffset: (
    offsetY: number,
    index: number,
    force?: boolean,
  ) => void;
};

// Create the context
const RefsContext = createContext<SharedRefs | null>(null);

// Provider component
export interface TabsProviderProps {
  children: ReactNode;
  /**
   * Scroll-reset mode shared by ScrollerContainer and HBScroller.
   */
  resetPreviousScrollingY?: boolean;
}

export const TabsProvider: React.FC<TabsProviderProps> = ({
  children,
  resetPreviousScrollingY = true,
}) => {
  /****** Level 0 ******/
  // this ref stores the minimum height the active tab content must fill.
  const minTabContentHeight = useRef(0);
  // this ref stores the latest available height of the vertical scroller area.
  const scrollerContainerHeight = useRef(0);
  // this ref used for the parent vertical scroller
  const vParentScroller = useRef<ScrollView>(null);

  // index of the active tab
  const currentTab = useRef(0);
  const currentTabIndex = useSharedValue(0);
  // this used to store the refs of the vertical scroll of the tab content
  const vChildrenScroll = useRef(new Map<number, ScrollableChild | null>());
  const childScrollOffsets = useRef(new Map<number, number>());
  // this used to store the size of the tab content (scroll content height)
  const tabContentSize = useRef(new Map<number, number>());
  const currentScrollingYValue = useSharedValue(0);

  // this ref used to save the top section layout details
  const topSectionLayout = useRef<LayoutRectangle | undefined>(undefined);
  const topSectionHeight = useSharedValue(0);

  // this shared value used to control the height of the view container of the tab content
  const tabViewContainerHeight = useSharedValue(0);

  // store the current scrolling y offset
  // used to fix the issue  of the not fully scrolling to the top of the tab content scroller
  const activeTabScrollYOffsetValue = useSharedValue(0);
  const pendingTabSwitchIndexValue = useSharedValue(-1);
  const pendingTabSwitchOffsetValue = useSharedValue(0);

  /****** Level 1 ******/
  // this ref used for the top tabs scroller
  const topTabScrollerRef = useRef<ScrollView>(null);
  //top tab list progress indicator
  const topSectionListProgress = useSharedValue(0);
  const hActiveScrollingX = useSharedValue(0);

  // this used to store the layout details of the top tabs (tabs scroller)
  const topTabLayout = useRef<LayoutRectangle | undefined>(undefined);
  // indicator width
  const indicatorWidth = useRef(0);
  // this used to store the layout details of each tab item
  const topTabItemsLayout = useRef(new Map<number, LayoutRectangle>());
  const indicatorWidthValue = useSharedValue(0);
  const topTabItemsLayoutValue = useSharedValue<TabLayoutMetrics>({});

  /****** Level 2 ******/
  // this ref used for the parent horizontal scroller
  const hParentScroller = useRef<FlatList>(null);
  // this used to store the tab scrolling offset (...) details saved in a map
  const tabScrollingDetails = useRef(new Map<number, { offset: number }>());
  const headerOffsetScrollValue = useSharedValue(0);
  // shared by level 1 and level 2
  // this used to manage the tab press and the scrolling onViewableItemsChanged
  // need to differentiate between the tab press and the scrolling onViewableItemsChanged
  const goToTabIndex = useRef(-1);

  const setActiveTabScrollYOffset = useCallback(
    (offset: number) => {
      activeTabScrollYOffsetValue.set(offset);
    },
    [activeTabScrollYOffsetValue],
  );

  const setActiveTabScrollYOffsetShared = useCallback(
    (offset: number) => {
      "worklet";
      activeTabScrollYOffsetValue.set(offset);
    },
    [activeTabScrollYOffsetValue],
  );

  const setGoToTabIndex = useCallback((index: number) => {
    goToTabIndex.current = index;
  }, []);

  const setCurrentTab = useCallback(
    (index: number) => {
      currentTab.current = index;
      currentTabIndex.set(index);
    },
    [currentTabIndex],
  );

  const setHorizontalScrollXShared = useCallback(
    (offset: number) => {
      "worklet";
      hActiveScrollingX.set(offset);
    },
    [hActiveScrollingX],
  );

  const setTopSectionListProgress = useCallback(
    (value: number) => {
      topSectionListProgress.set(value);
    },
    [topSectionListProgress],
  );

  const setTopSectionListProgressShared = useCallback(
    (value: number) => {
      "worklet";
      topSectionListProgress.set(value);
    },
    [topSectionListProgress],
  );

  const syncMinTabContentHeight = useCallback(
    (containerHeight?: number) => {
      if (typeof containerHeight === "number") {
        scrollerContainerHeight.current = containerHeight;
      }

      if (scrollerContainerHeight.current <= 0) {
        return;
      }

      const nextMinHeight = Math.max(
        scrollerContainerHeight.current - (topTabLayout.current?.height || 0),
        0,
      );

      minTabContentHeight.current = nextMinHeight;
      hParentScroller.current?.setNativeProps({
        style: { height: nextMinHeight },
      });

      const activeTabHeight =
        tabContentSize.current.get(currentTab.current) || 0;
      tabViewContainerHeight.set(Math.max(activeTabHeight, nextMinHeight));
    },
    [tabViewContainerHeight],
  );

  const setTopTabLayout = useCallback(
    (layout: LayoutRectangle) => {
      topTabLayout.current = layout;
      syncMinTabContentHeight();
    },
    [syncMinTabContentHeight],
  );

  const setHeaderOffsetScrollShared = useCallback(
    (offset: number) => {
      "worklet";
      headerOffsetScrollValue.set(offset);
    },
    [headerOffsetScrollValue],
  );

  const setIndicatorWidth = useCallback(
    (width: number) => {
      indicatorWidth.current = width;
      indicatorWidthValue.set(width);
    },
    [indicatorWidthValue],
  );

  const setTopTabItemLayout = useCallback(
    (index: number, layout: LayoutRectangle) => {
      topTabItemsLayout.current.set(index, layout);
      // Rebuild from the ref map so rapid onLayout callbacks cannot clobber
      // previously measured tabs with a stale shared-value snapshot.
      topTabItemsLayoutValue.set(
        serializeTopTabLayouts(topTabItemsLayout.current),
      );
    },
    [topTabItemsLayoutValue],
  );

  const setVChildScrollRef = useCallback(
    (index: number, ref: ScrollableChild | null) => {
      const previousRef = vChildrenScroll.current.get(index);
      if (previousRef === ref) {
        return;
      }

      vChildrenScroll.current.set(index, ref);
      childScrollOffsets.current.delete(index);
    },
    [],
  );

  const setTabContentHeight = useCallback(
    (index: number, height: number) => {
      const previousHeight = tabContentSize.current.get(index);
      if (previousHeight === height) {
        return;
      }

      tabContentSize.current.set(index, height);

      if (index === currentTab.current) {
        tabViewContainerHeight.set(
          Math.max(height, minTabContentHeight.current),
        );
      }
    },
    [tabViewContainerHeight],
  );

  const setCurrentScrollingYShared = useCallback(
    (offset: number) => {
      "worklet";
      currentScrollingYValue.set(offset);
    },
    [currentScrollingYValue],
  );

  const setScrollerContainerHeight = useCallback(
    (height: number) => {
      syncMinTabContentHeight(height);
    },
    [syncMinTabContentHeight],
  );

  const setTabViewContainerHeight = useCallback(
    (height: number) => {
      tabViewContainerHeight.set(height);
    },
    [tabViewContainerHeight],
  );

  const setPendingTabSwitchOffset = useCallback(
    (index: number, offset: number) => {
      pendingTabSwitchIndexValue.set(index);
      pendingTabSwitchOffsetValue.set(Math.max(offset, 0));
    },
    [pendingTabSwitchIndexValue, pendingTabSwitchOffsetValue],
  );

  const clearPendingTabSwitch = useCallback(() => {
    "worklet";
    pendingTabSwitchIndexValue.set(-1);
  }, [pendingTabSwitchIndexValue]);

  const setTopSectionLayout = useCallback(
    (layout: LayoutRectangle) => {
      topSectionLayout.current = layout;
      topSectionHeight.set(layout.height);
    },
    [topSectionHeight],
  );

  const deleteTabScrollOffset = useCallback((index: number) => {
    tabScrollingDetails.current.delete(index);
  }, []);

  const setTabScrollOffset = useCallback((index: number, offset: number) => {
    tabScrollingDetails.current.set(index, {
      offset: Math.max(offset, 0),
    });
  }, []);

  const adjustTabScrollOffsets = useCallback((delta: number) => {
    if (!delta) return;
    tabScrollingDetails.current.forEach((value) => {
      if (value) {
        value.offset += delta;
      }
    });
  }, []);

  const onTabChange = useCallback(
    (index: number, isScrolling = false) => {
      if (currentTab.current === index) {
        return;
      }

      // scroll the tab content to the active index
      if (!isScrolling) {
        if (
          indicatorWidth.current > 0 &&
          topTabItemsLayout.current.has(index)
        ) {
          const nextIndicatorOffset = getLeftOffset(
            index,
            topTabItemsLayout.current,
            indicatorWidth.current,
          );
          cancelAnimation(topSectionListProgress);
          topSectionListProgress.set(
            withTiming(nextIndicatorOffset, {
              duration: 220,
            }),
          );
        }

        hParentScroller.current?.scrollToIndex({
          index,
          animated: true,
        });
      }

      const activeTabLayout = topTabItemsLayout.current.get(index);
      const center =
        (topTabLayout.current?.width || 0) / 2 -
        (activeTabLayout?.width || 0) / 2;
      const listOffset = Math.max((activeTabLayout?.x || 0) - center, 0);
      topTabScrollerRef.current?.scrollTo({
        x: listOffset,
        animated: true,
      });
    },
    [topSectionListProgress],
  );

  // helper to scroll current tab content
  const vChildScrollToOffset = useCallback(
    (offsetY: number, index: number, force = false) => {
      const normalizedOffset = Math.max(offsetY, 0);
      const previousOffset = childScrollOffsets.current.get(index);
      if (
        !force &&
        previousOffset !== undefined &&
        Math.abs(previousOffset - normalizedOffset) < 0.5
      ) {
        return;
      }

      const child = vChildrenScroll.current.get(index);
      if (!child) {
        return;
      }

      childScrollOffsets.current.set(index, normalizedOffset);

      if (typeof (child as any).scrollTo === "function") {
        (child as any).scrollTo({ x: 0, y: normalizedOffset, animated: false });
      } else if (typeof (child as any).scrollToOffset === "function") {
        (child as any).scrollToOffset({
          offset: normalizedOffset,
          animated: false,
        });
      } else if (typeof (child as any).getScrollResponder === "function") {
        const responder = (child as any).getScrollResponder();

        if (typeof responder?.scrollTo === "function") {
          responder.scrollTo({
            x: 0,
            y: normalizedOffset,
            animated: false,
          });
        }
      }
    },
    [],
  );

  return (
    <RefsContext.Provider
      value={{
        resetPreviousScrollingY,
        minTabContentHeight,
        vParentScroller,
        hParentScroller,
        currentTab,
        currentTabIndex,
        tabContentSize,
        currentScrollingYValue,
        topSectionLayout,
        topSectionHeight,
        tabViewContainerHeight,
        activeTabScrollYOffsetValue,
        pendingTabSwitchIndexValue,
        pendingTabSwitchOffsetValue,
        topTabScrollerRef,
        topSectionListProgress,
        hActiveScrollingX,
        indicatorWidth,
        indicatorWidthValue,
        topTabItemsLayout,
        topTabItemsLayoutValue,
        tabScrollingDetails,
        headerOffsetScrollValue,
        goToTabIndex,
        setActiveTabScrollYOffset,
        setActiveTabScrollYOffsetShared,
        setGoToTabIndex,
        setCurrentTab,
        setHorizontalScrollXShared,
        setTopSectionListProgress,
        setTopSectionListProgressShared,
        setTopTabLayout,
        setHeaderOffsetScrollShared,
        setIndicatorWidth,
        setTopTabItemLayout,
        setVChildScrollRef,
        setTabContentHeight,
        setCurrentScrollingYShared,
        setScrollerContainerHeight,
        setTabViewContainerHeight,
        setPendingTabSwitchOffset,
        clearPendingTabSwitch,
        deleteTabScrollOffset,
        setTabScrollOffset,
        setTopSectionLayout,
        adjustTabScrollOffsets,
        onTabChange,
        vChildScrollToOffset,
      }}
    >
      {children}
    </RefsContext.Provider>
  );
};

// Custom hook to use the context
export const useSharedRefs = (): SharedRefs => {
  const context = useContext(RefsContext);
  if (!context) {
    throw new Error(
      "useSharedRefs(context) must be used within a TabsProvider",
    );
  }
  return context;
};
