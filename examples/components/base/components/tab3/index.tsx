import * as React from "react";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { Text, View } from "react-native";

import type { BaseTabPageProps } from "../shared";
import {
  COLORS,
  getGridItemSpacingStyle,
  NUM_COLUMNS,
  SyncedFlashList,
  styles,
} from "../shared";

type GridItemData = {
  id: string;
  color: string;
  label: number;
};

const GridItem = React.memo(
  ({ item, itemIndex }: { item: GridItemData; itemIndex: number }) => (
    <View
      style={[
        styles.gridItem,
        getGridItemSpacingStyle(itemIndex),
        { backgroundColor: item.color },
      ]}
    >
      <Text style={styles.gridItemText}>{item.label}</Text>
    </View>
  ),
);
GridItem.displayName = "BaseGridItem";

export const GridTab = ({ index, width }: BaseTabPageProps) => {
  const data = React.useMemo(
    () =>
      new Array(100).fill(0).map((_, itemIndex) => ({
        id: `${index}-${itemIndex}`,
        color: COLORS[itemIndex % COLORS.length],
        label: itemIndex + 1,
      })),
    [index],
  );

  const renderItem = React.useCallback(
    ({ item, index: itemIndex }: ListRenderItemInfo<GridItemData>) => (
      <GridItem item={item} itemIndex={itemIndex} />
    ),
    [],
  );

  return (
    <SyncedFlashList
      index={index}
      data={data}
      width={width}
      numColumns={NUM_COLUMNS}
      renderItem={renderItem}
      keyExtractor={(item: GridItemData) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};
