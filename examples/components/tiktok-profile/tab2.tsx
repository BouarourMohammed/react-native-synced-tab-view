import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import {
  PROFILE_USERNAME,
  type TikTokTabPageProps,
  SyncedLegendList,
  styles,
} from "./shared";

const LikedVideosEmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="lock-closed-outline" size={48} color="#555" />
      <Text style={styles.emptyTitle}>Liked videos are private</Text>
      <Text style={styles.emptySubtitle}>
        Videos liked by {PROFILE_USERNAME} are currently hidden.
      </Text>
    </View>
  );
};

export const LikedTabScene = ({ index, width }: TikTokTabPageProps) => {
  const renderItem = React.useCallback(() => null, []);

  return (
    <SyncedLegendList
      index={index}
      width={width}
      data={[]}
      renderItem={renderItem}
      ListEmptyComponent={LikedVideosEmptyState}
      maintainVisibleContentPosition={false}
      showsVerticalScrollIndicator={false}
    />
  );
};
