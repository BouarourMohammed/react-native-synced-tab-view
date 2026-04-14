import * as React from "react";
import {
  type LegendListRenderItemProps,
} from "@legendapp/list";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import {
  buildVideoItems,
  type TikTokTabPageProps,
  type VideoItem,
  SyncedLegendList,
  styles,
  VIDEO_CARD_HEIGHT,
  VIDEO_GRID_COLUMN_WRAPPER_STYLE,
  VIDEO_GRID_CONTENT_CONTAINER_STYLE,
} from "./shared";

const VideoCard = React.memo(({ item }: { item: VideoItem }) => (
  <View style={[styles.videoCard, { backgroundColor: item.color }]}>
    <View style={styles.videoOverlay}>
      <Ionicons name="play" size={12} color="#fff" />
      <Text style={styles.videoViews}>{item.views}</Text>
    </View>
  </View>
));
VideoCard.displayName = "TikTokVideoCard";

export const VideosTabScene = ({ index, width }: TikTokTabPageProps) => {
  const data = React.useMemo(() => buildVideoItems(index), [index]);

  const renderItem = React.useCallback(
    ({ item }: LegendListRenderItemProps<VideoItem>) => (
      <VideoCard item={item} />
    ),
    [],
  );

  return (
    <SyncedLegendList
      index={index}
      width={width}
      data={data}
      numColumns={3}
      columnWrapperStyle={VIDEO_GRID_COLUMN_WRAPPER_STYLE}
      contentContainerStyle={VIDEO_GRID_CONTENT_CONTAINER_STYLE}
      renderItem={renderItem}
      keyExtractor={(item: VideoItem) => item.id}
      maintainVisibleContentPosition={false}
      recycleItems
      estimatedItemSize={VIDEO_CARD_HEIGHT}
      getFixedItemSize={() => VIDEO_CARD_HEIGHT}
      showsVerticalScrollIndicator={false}
    />
  );
};
