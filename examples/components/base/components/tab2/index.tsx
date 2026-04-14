import * as React from "react";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { Text, View } from "react-native";

import type { BaseTabPageProps } from "../shared";
import {
  COLORS,
  LIST_CONTENT_CONTAINER_STYLE,
  SyncedFlashList,
  styles,
} from "../shared";

type ListItemData = {
  id: string;
  title: string;
  subtitle: string;
  iconColor: string;
};

const ListItem = React.memo(({ item }: { item: ListItemData }) => (
  <View style={styles.listItem}>
    <View style={[styles.listItemIcon, { backgroundColor: item.iconColor }]} />
    <View style={styles.listItemContent}>
      <Text style={styles.listItemTitle}>{item.title}</Text>
      <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>
    </View>
  </View>
));
ListItem.displayName = "BaseListItem";

export const ListTab = ({ index, width }: BaseTabPageProps) => {
  const data = React.useMemo(
    () =>
      new Array(50).fill(0).map((_, itemIndex) => ({
        id: `list-${index}-${itemIndex}`,
        title: `Item ${itemIndex + 1}`,
        subtitle: `Description for item ${itemIndex + 1}`,
        iconColor: COLORS[itemIndex % COLORS.length],
      })),
    [index],
  );

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<ListItemData>) => <ListItem item={item} />,
    [],
  );

  return (
    <SyncedFlashList
      index={index}
      data={data}
      width={width}
      contentContainerStyle={LIST_CONTENT_CONTAINER_STYLE}
      renderItem={renderItem}
      keyExtractor={(item: ListItemData) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};
