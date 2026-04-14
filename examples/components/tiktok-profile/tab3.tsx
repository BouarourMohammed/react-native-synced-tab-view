import * as React from "react";
import { type LegendListRenderItemProps } from "@legendapp/list";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import {
  type SavedCollectionItem,
  SAVED_CARD_HEIGHT,
  SAVED_COLLECTIONS,
  SAVED_COLUMN_WRAPPER_STYLE,
  SAVED_CONTENT_CONTAINER_STYLE,
  type TikTokTabPageProps,
  SyncedLegendList,
  styles,
} from "./shared";

const SavedCollectionCard = React.memo(
  ({ item }: { item: SavedCollectionItem }) => (
    <View style={styles.savedCard}>
      <View style={[styles.savedCardCover, { backgroundColor: item.color }]}>
        <Ionicons name="bookmark" size={24} color="rgba(255,255,255,0.7)" />
      </View>
      <Text style={styles.savedCardLabel} numberOfLines={1}>
        {item.label}
      </Text>
      <Text style={styles.savedCardCount}>{item.count} videos</Text>
    </View>
  ),
);
SavedCollectionCard.displayName = "TikTokSavedCollectionCard";

export const SavedCollectionsTab = ({ index, width }: TikTokTabPageProps) => {
  const renderItem = React.useCallback(
    ({ item }: LegendListRenderItemProps<SavedCollectionItem>) => (
      <SavedCollectionCard item={item} />
    ),
    [],
  );

  return (
    <SyncedLegendList
      index={index}
      width={width}
      data={SAVED_COLLECTIONS}
      numColumns={2}
      columnWrapperStyle={SAVED_COLUMN_WRAPPER_STYLE}
      contentContainerStyle={SAVED_CONTENT_CONTAINER_STYLE}
      renderItem={renderItem}
      keyExtractor={(item: SavedCollectionItem) => item.id}
      maintainVisibleContentPosition={false}
      recycleItems
      estimatedItemSize={SAVED_CARD_HEIGHT}
      showsVerticalScrollIndicator={false}
    />
  );
};
