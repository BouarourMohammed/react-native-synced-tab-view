import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { BOTTOM_PADDING_OFFSET } from "../internal/constants";
import { useSharedRefs } from "../internal/RefsContext";
import { useTabContentSync } from "../internal/useTabContentSync";

export type ScrollerBaseProps = {
  onContentSizeChange?: (w: number, h: number) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  pinchGestureEnabled?: boolean;
  nestedScrollEnabled?: boolean;
};

type SyncedTabScrollComponentProps<P> = P &
  ScrollerBaseProps & {
    index: number;
    width?: number;
  };

/**
 * Factory to create a synchronized tab scroll component.
 * Wraps any scrollable component (FlatList, ScrollView, etc.)
 * and applies shared tab height and content size logic.
 *
 * Prefer assigning the returned wrapper to a distinct package-facing name such
 * as `SyncedLegendList` or `SyncedFlashList`.
 */
export function createSyncedTabScrollComponent<P, TRef = unknown>(
  Scroller: React.ComponentType<P & ScrollerBaseProps>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<SyncedTabScrollComponentProps<P>> &
    React.RefAttributes<TRef>
> {
  const AnimatedScroller = Animated.createAnimatedComponent(Scroller as any);
  const displayName = Scroller.displayName || Scroller.name || "Component";
  const syncedDisplayName = displayName.startsWith("Synced")
    ? displayName
    : `Synced${displayName}`;

  const TabScrollComponent = React.forwardRef<
    TRef,
    SyncedTabScrollComponentProps<P>
  >((props, forwardedRef) => {
    const { style, contentContainerStyle, index, onContentSizeChange, width, ...rest } =
      props;
    const { setTabContentHeight } = useSharedRefs();
    const { animatedRef, setRefs } = useTabContentSync<TRef>(index);

    React.useImperativeHandle(
      forwardedRef,
      () => animatedRef.current as TRef,
    );

    const handleContentSizeChange = React.useCallback(
      (w: number, h: number) => {
        onContentSizeChange?.(w, h);

        // The child keeps extra bottom padding to preserve the bounce effect
        // from the parent scroller; subtract it from the measured content size.
        const height = Math.max(h - BOTTOM_PADDING_OFFSET, 0);
        setTabContentHeight(index, height);
      },
      [index, onContentSizeChange, setTabContentHeight],
    );

    return React.createElement(AnimatedScroller as any, {
      style: [style, { width: width ?? "100%" }],
      onContentSizeChange: handleContentSizeChange,
      contentContainerStyle: [
        contentContainerStyle,
        { paddingBottom: BOTTOM_PADDING_OFFSET },
      ],
      ...(rest as any),
      ref: setRefs as any,
      scrollEnabled: false,
      pinchGestureEnabled: false,
    });
  });

  TabScrollComponent.displayName = syncedDisplayName;

  return TabScrollComponent;
}
