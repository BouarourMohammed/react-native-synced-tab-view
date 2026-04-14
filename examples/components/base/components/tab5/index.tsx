import * as React from "react";
import { ScrollView, Text, View } from "react-native";
import { TabScrollView } from "react-native-synced-tab-view";

import type { BaseTabPageProps } from "../shared";
import { COLORS, styles } from "../shared";

type HorizontalScrollerItemData = {
  id: string;
  label: string;
  color: string;
};

type StackedItemData = {
  id: string;
  title: string;
  color: string;
};

const HorizontalScrollerItem = React.memo(
  ({ item }: { item: HorizontalScrollerItemData }) => (
    <View
      style={[styles.horizontalScrollerItem, { backgroundColor: item.color }]}
    >
      <Text style={styles.horizontalScrollerItemText}>{item.label}</Text>
    </View>
  ),
);
HorizontalScrollerItem.displayName = "HorizontalScrollerItem";

const StackedScrollerItem = React.memo(
  ({ item }: { item: StackedItemData }) => (
    <View style={styles.stackedScrollerItem}>
      <View
        style={[
          styles.stackedScrollerItemAccent,
          { backgroundColor: item.color },
        ]}
      />
      <Text style={styles.stackedScrollerItemText}>{item.title}</Text>
    </View>
  ),
);
StackedScrollerItem.displayName = "StackedScrollerItem";

export const HorizontalScrollerTab = ({ index, width }: BaseTabPageProps) => {
  const horizontalData = React.useMemo(
    () =>
      new Array(10).fill(0).map((_, itemIndex) => ({
        id: `horizontal-${index}-${itemIndex}`,
        label: `${itemIndex + 1}`,
        color: COLORS[itemIndex % COLORS.length],
      })),
    [index],
  );

  const stackedData = React.useMemo(
    () =>
      new Array(20).fill(0).map((_, itemIndex) => ({
        id: `stacked-${index}-${itemIndex}`,
        title: `Row Item ${itemIndex + 1}`,
        color: COLORS[(itemIndex + 2) % COLORS.length],
      })),
    [index],
  );

  return (
    <TabScrollView index={index} width={width} nestedScrollEnabled>
      <View style={styles.scrollerTabInner}>
        <Text style={styles.scrollerTabTitle}>Horizontal Scroll Row</Text>
        <ScrollView
          horizontal
          style={styles.horizontalScrollerList}
          contentContainerStyle={styles.horizontalScrollerListContent}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
        >
          {horizontalData.map((item, itemIndex) => (
            <View
              key={item.id}
              style={
                itemIndex === horizontalData.length - 1
                  ? undefined
                  : styles.horizontalScrollerSeparator
              }
            >
              <HorizontalScrollerItem item={item} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.stackedScrollerList}>
          {stackedData.map((item) => (
            <StackedScrollerItem key={item.id} item={item} />
          ))}
        </View>
      </View>
    </TabScrollView>
  );
};
