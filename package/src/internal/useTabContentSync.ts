import * as React from "react";
import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
} from "react-native-reanimated";
import { useSharedRefs } from "./RefsContext";

export const useTabContentSync = <T>(index: number) => {
  const {
    currentTabIndex,
    activeTabScrollYOffsetValue,
    clearPendingTabSwitch,
    pendingTabSwitchIndexValue,
    pendingTabSwitchOffsetValue,
    setVChildScrollRef,
  } = useSharedRefs();
  const animatedRef = useAnimatedRef<any>();

  useAnimatedReaction(
    () => {
      if (
        currentTabIndex.value !== index ||
        pendingTabSwitchIndexValue.value !== index
      ) {
        return -1;
      }

      return pendingTabSwitchOffsetValue.value;
    },
    (nextOffset) => {
      if (nextOffset < 0) {
        return;
      }

      scrollTo(animatedRef as any, 0, nextOffset, false);
      clearPendingTabSwitch();
    },
    [animatedRef, clearPendingTabSwitch, index],
  );

  useAnimatedReaction(
    () => {
      if (
        currentTabIndex.value !== index ||
        pendingTabSwitchIndexValue.value === index
      ) {
        return -1;
      }

      return activeTabScrollYOffsetValue.value;
    },
    (nextOffset, previousOffset) => {
      if (nextOffset < 0) {
        return;
      }

      if (
        previousOffset !== null &&
        previousOffset !== undefined &&
        Math.abs(nextOffset - previousOffset) < 0.5
      ) {
        return;
      }

      scrollTo(animatedRef as any, 0, nextOffset, false);
    },
    [animatedRef, index],
  );

  const setRefs = React.useCallback(
    (ref: T | null) => {
      (animatedRef as any)(ref);
      setVChildScrollRef(index, ref as any);
    },
    [animatedRef, index, setVChildScrollRef],
  );

  return {
    animatedRef,
    setRefs,
  };
};
