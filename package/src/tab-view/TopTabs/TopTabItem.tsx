import React, { useCallback } from "react";
import { Text, Pressable } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTopTabsContext } from "./TopTabsContext";

export interface TopTabItemProps {
  index: number;
  title: string;
}

const TopTabItem = ({ index, title }: TopTabItemProps) => {
  const { hActiveScrollingX, onTabPress, onTabItemLayout, config } =
    useTopTabsContext();

  const {
    width,
    tabItemStyle,
    tabTextStyle,
    activeColor = "rgba(255,0,0,1)",
    inactiveColor = "rgba(255,0,0,0)",
    activeOpacity = 1,
    inactiveOpacity = 0.5,
  } = config;

  const animatedStyle = useAnimatedStyle(() => {
    const progress = Math.max(
      Math.min(1 - Math.abs(hActiveScrollingX.value / width - index), 1),
      0,
    );
    const opacity =
      progress * (activeOpacity - inactiveOpacity) + inactiveOpacity;
    return {
      opacity,
      backgroundColor: progress > 0.5 ? activeColor : inactiveColor,
    };
  }, [activeColor, inactiveColor, activeOpacity, inactiveOpacity, width]);

  const handlePress = useCallback(() => {
    onTabPress(index);
  }, [index, onTabPress]);

  return (
    <Pressable
      onLayout={(e) => {
        onTabItemLayout(index, e.nativeEvent.layout);
      }}
      onPress={handlePress}
    >
      <Animated.View style={[tabItemStyle, animatedStyle]}>
        <Text style={tabTextStyle}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const MemoizedTopTabItem = React.memo(
  TopTabItem,
  (prevProps, nextProps) =>
    prevProps.index === nextProps.index && prevProps.title === nextProps.title,
);

export default MemoizedTopTabItem;
