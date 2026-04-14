import * as React from "react";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  AnimatedStyle,
} from "react-native-reanimated";
import { ViewStyle } from "react-native";
import { useTopTabsContext } from "./TopTabsContext";

export interface TopTabIndicatorProps {
  /**
   * Width of the indicator in pixels
   * @default 50
   */
  indicatorWidth?: number;
  /**
   * Height of the indicator in pixels
   * @default 4
   */
  indicatorHeight?: number;
  /**
   * Background color of the indicator
   * @default "white"
   */
  indicatorColor?: string;
  /**
   * Additional custom styles for the indicator
   */
  indicatorStyle?: AnimatedStyle<ViewStyle>;
}

const TopTabIndicator = ({
  indicatorWidth: customIndicatorWidth,
  indicatorHeight: customIndicatorHeight,
  indicatorColor: customIndicatorColor,
  indicatorStyle: customIndicatorStyle,
}: TopTabIndicatorProps) => {
  const {
    topSectionListProgress,
    headerOffsetScrollValue,
    onIndicatorLayout,
    config,
  } = useTopTabsContext();

  const {
    indicatorWidth: contextIndicatorWidth = 50,
    indicatorHeight: contextIndicatorHeight = 4,
    indicatorColor: contextIndicatorColor = "white",
    indicatorStyle: contextIndicatorStyle,
    indicatorBorderRadius = 0,
    indicatorOpacity = 1,
    indicatorPosition = "bottom",
    indicatorMarginTop = 0,
    indicatorMarginBottom = 0,
    indicatorMarginHorizontal = 0,
    indicatorDisableLayoutTransition = false,
  } = config;

  // Use prop values if provided, otherwise fall back to context values
  const indicatorWidth = customIndicatorWidth ?? contextIndicatorWidth;
  const indicatorHeight = customIndicatorHeight ?? contextIndicatorHeight;
  const indicatorColor = customIndicatorColor ?? contextIndicatorColor;
  const indicatorStyle = customIndicatorStyle ?? contextIndicatorStyle;

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            topSectionListProgress.value - headerOffsetScrollValue.value,
        },
      ],
    };
  });

  const verticalPositionStyle =
    indicatorPosition === "top"
      ? { top: indicatorMarginTop }
      : { bottom: indicatorMarginBottom };

  return (
    <Animated.View
      pointerEvents="none"
      onLayout={(e) => onIndicatorLayout(e.nativeEvent.layout.width)}
      layout={indicatorDisableLayoutTransition ? undefined : LinearTransition}
      style={[
        {
          position: "absolute",
          left: indicatorMarginHorizontal,
          width: indicatorWidth,
          height: indicatorHeight,
          backgroundColor: indicatorColor,
          borderRadius: indicatorBorderRadius,
          opacity: indicatorOpacity,
          zIndex: 1,
        },
        verticalPositionStyle,
        indicatorStyle,
        indicatorAnimatedStyle,
      ]}
    />
  );
};

export default TopTabIndicator;
