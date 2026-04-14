import * as React from "react";
import { View, ViewProps, LayoutChangeEvent } from "react-native";
import { useSharedRefs } from "../internal/RefsContext";

export interface TopSectionProps extends ViewProps {
  children?: React.ReactNode;
}

const TopSection: React.FC<TopSectionProps> = ({
  children,
  onLayout,
  ...props
}) => {
  const {
    topSectionLayout,
    setTopSectionLayout,
    adjustTabScrollOffsets,
  } = useSharedRefs();
  const _onLayout = (e: LayoutChangeEvent) => {
    const previousLayout = topSectionLayout.current;
    const nextLayout = e.nativeEvent.layout;
    const delta = previousLayout ? nextLayout.height - previousLayout.height : 0;

    setTopSectionLayout(nextLayout);

    if (previousLayout) {
      // calculate the difference between the previous layout and the current layout
      // if changed, shift the saved per-tab offsets by the same delta
      if (Math.abs(delta) > 0) {
        adjustTabScrollOffsets(delta);
      }
    }
    onLayout?.(e);
  };
  return (
    <View onLayout={_onLayout} {...props}>
      {children}
    </View>
  );
};

export default TopSection;
