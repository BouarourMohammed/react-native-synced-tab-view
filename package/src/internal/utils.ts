import { LayoutRectangle } from "react-native";

export type TabLayoutMetrics = Record<number, Pick<LayoutRectangle, "x" | "width">>;

type TabLayouts = Map<number, LayoutRectangle> | TabLayoutMetrics;
type TabIdentity = {
  key?: string | number;
  id?: string | number;
};

export const getTabItemKey = (item: TabIdentity, index: number) => {
  const stableKey = item.key ?? item.id;

  if (stableKey !== undefined && stableKey !== null) {
    return String(stableKey);
  }

  return `tab-${index}`;
};

export const serializeTopTabLayouts = (
  layouts: Map<number, LayoutRectangle>,
): TabLayoutMetrics => {
  const metrics: TabLayoutMetrics = {};

  layouts.forEach((layout, index) => {
    metrics[index] = {
      x: layout.x,
      width: layout.width,
    };
  });

  return metrics;
};

const getLayoutAtIndex = (
  layouts: TabLayouts,
  index: number,
): Pick<LayoutRectangle, "x" | "width"> | undefined => {
  "worklet";

  if (typeof (layouts as Map<number, LayoutRectangle>).get === "function") {
    return (layouts as Map<number, LayoutRectangle>).get(index);
  }

  return (layouts as TabLayoutMetrics)[index];
};

export const getLeftOffset = (
  index: number,
  layouts: TabLayouts,
  indicatorWidth: number,
  progressPercentage: number = 0,
) => {
  "worklet";

  const clampedProgress = Math.max(Math.min(progressPercentage, 1), 0);
  const currentLayout = getLayoutAtIndex(layouts, index);
  if (!currentLayout) {
    return 0;
  }

  const nextLayout = getLayoutAtIndex(layouts, index + 1) || currentLayout;
  const currentCenter = currentLayout.x + currentLayout.width / 2;
  const nextCenter = nextLayout.x + nextLayout.width / 2;

  return (
    currentCenter +
    (nextCenter - currentCenter) * clampedProgress -
    indicatorWidth / 2
  );
};
