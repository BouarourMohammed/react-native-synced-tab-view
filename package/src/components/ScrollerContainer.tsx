import * as React from "react";
import { LayoutChangeEvent, ScrollViewProps } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSharedRefs } from "../internal/RefsContext";

export interface ScrollerContainerProps extends ScrollViewProps {
  children?: React.ReactNode;
}

const ScrollerContainer: React.FC<ScrollerContainerProps> = ({
  children,
  style,
  onScroll,
  onLayout,
  stickyHeaderIndices = [],
  scrollEventThrottle,
  showsVerticalScrollIndicator = false,
  ...props
}) => {
  const {
    resetPreviousScrollingY,
    vParentScroller,
    activeTabScrollYOffsetValue,
    topSectionHeight,
    setScrollerContainerHeight,
    setActiveTabScrollYOffsetShared,
    setCurrentScrollingYShared,
    currentTabIndex,
    deleteTabScrollOffset,
  } = useSharedRefs();

  // used only when resetPreviousScrollingY is false, when resetPreviousScrollingY is true,
  // the activeTabScrollYOffsetValue will be reset to 0 directly when the user scroll up and down around
  // the topSectionHeight.value gaps, so no need to check if the current tab has been scrolled to an offset or not
  const previousContainerOffset = useSharedValue(
    resetPreviousScrollingY ? -1 : 0,
  );
  // this use mainly to know if the current tab has been scrolled to an offset to avoid having small offsetY in
  // the child when the user scroll up and down around the topSectionHeight.value caused by scrolling Y event from
  // the child when the offsetY is around topSectionHeight.value gaps
  // this used only when resetPreviousScrollingY is false, when resetPreviousScrollingY is true, the activeTabScrollYOffsetValue
  // will be reset to 0 directly when the user scroll up and down around the topSectionHeight.value gaps, so no need to check if
  // the current tab has been scrolled to an offset or not
  // Represents the consumption of the offset
  const resetPositionKeysMangager = useSharedValue<Map<number, boolean>>(
    new Map(),
  );
  const handleExternalScroll = React.useCallback(
    (e: any) => {
      onScroll?.(e);
    },
    [onScroll],
  );

  const triggerExternalScroll = React.useCallback(
    (e: any) => {
      "worklet";
      if (onScroll) {
        scheduleOnRN(handleExternalScroll, e);
      }
    },
    [handleExternalScroll, onScroll],
  );

  const onScrolleffect = React.useCallback(
    (position: number) => {
      vParentScroller?.current?.scrollTo?.({
        x: 0,
        y: position,
        animated: false,
      });
    },
    [resetPreviousScrollingY],
  );

  const syncResetPositionKeys = React.useCallback((tabIndex: number) => {
    "worklet";
    resetPositionKeysMangager.value.set(tabIndex, true);
    resetPositionKeysMangager.value.forEach((value, key) => {
      if (key !== tabIndex) {
        resetPositionKeysMangager.value.set(key, false);
      }
    });
  }, []);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        const offsetY = e.contentOffset.y;
        const sectionHeight = topSectionHeight.value;
        const activeTabIndex = currentTabIndex.value;
        setCurrentScrollingYShared(offsetY);

        if (!sectionHeight) {
          triggerExternalScroll(e);
          return;
        }

        const childOffsetY = Math.max(offsetY - sectionHeight, 0);
        if (Math.abs(childOffsetY - activeTabScrollYOffsetValue.value) >= 0.5) {
          if (offsetY >= sectionHeight) {
            if (resetPreviousScrollingY) {
              setActiveTabScrollYOffsetShared(childOffsetY);
            } else {
              if (
                previousContainerOffset.value < sectionHeight &&
                offsetY >= sectionHeight &&
                activeTabScrollYOffsetValue.value > 0 &&
                !resetPositionKeysMangager.value.get(activeTabIndex)
              ) {
                const newOffsetY =
                  activeTabScrollYOffsetValue.value + sectionHeight;
                scheduleOnRN(onScrolleffect, newOffsetY);
                // reset all the other keys to false to make sure the scrollTo can be triggered next time when the
                // user scroll up and down around the topSectionHeight.value gaps
                syncResetPositionKeys(activeTabIndex);
                // activeTabScrollYOffsetValue.value = newOffsetY;
                scheduleOnRN(deleteTabScrollOffset, activeTabIndex);
              } else {
                setActiveTabScrollYOffsetShared(childOffsetY);
              }
            }
          } else {
            // this used a avoid having small offsetY in the child when the user scroll up and down around the topSectionHeight.value caused by scrolling Y event from the child when the offsetY is around topSectionHeight.value gaps
            if (activeTabScrollYOffsetValue.value > 0) {
              if (resetPreviousScrollingY) {
                setActiveTabScrollYOffsetShared(0);
              } else {
                // console.log(
                //   "resetPositionKeysMangager.value.get(currentTabIndex.value) : ",
                //   resetPositionKeysMangager.value.get(currentTabIndex.value),
                // );
                if (
                  resetPositionKeysMangager.value.get(activeTabIndex) ||
                  resetPositionKeysMangager.value.get(activeTabIndex) ===
                    undefined
                ) {
                  setActiveTabScrollYOffsetShared(0);
                }
              }
            }
          }
          // scheduleOnRN(deleteTabScrollOffset, currentTabIndex.value);
        }
        // Here we manually reset the child's last scroll offset when it is not detected by the child's scroll event.
        // This can happen when the user scrolls up and down near topSectionHeight.value.
        // It helps avoid keeping a small offsetY in the child caused by unstable scroll events around the topSectionHeight.value threshold.
        if (
          !resetPreviousScrollingY &&
          (activeTabScrollYOffsetValue.value < 0.5 ||
            offsetY >= sectionHeight) &&
          !resetPositionKeysMangager.value.get(activeTabIndex)
        ) {
          // reset all the other keys to false to make sure the scrollTo can be triggered next time when the user scroll
          // up and down around the topSectionHeight.value gaps
          syncResetPositionKeys(activeTabIndex);
        }

        triggerExternalScroll(e);
        if (!resetPreviousScrollingY) {
          previousContainerOffset.set(offsetY);
        }
      },
    },
    [
      deleteTabScrollOffset,
      handleExternalScroll,
      onScrolleffect,
      onScroll,
      setActiveTabScrollYOffsetShared,
      setCurrentScrollingYShared,
      syncResetPositionKeys,
      triggerExternalScroll,
    ],
  );

  const _onLayout = (e: LayoutChangeEvent) => {
    onLayout?.(e);
    setScrollerContainerHeight(e.nativeEvent.layout.height);
  };

  return (
    <Animated.ScrollView
      style={[{ flex: 1 }, style]}
      onLayout={_onLayout}
      onScroll={scrollHandler}
      nestedScrollEnabled={true}
      stickyHeaderIndices={[1].concat(stickyHeaderIndices)}
      {...props}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      scrollEventThrottle={scrollEventThrottle ?? 16}
      ref={vParentScroller as any}
    >
      {children}
    </Animated.ScrollView>
  );
};

export default ScrollerContainer;
