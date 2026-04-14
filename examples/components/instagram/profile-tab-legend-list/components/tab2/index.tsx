import * as React from "react";
import { type LegendListRenderItemProps } from "@legendapp/list";

import {
  getInstagramItemSpacingStyle,
  INSTAGRAM_NUM_COLUMNS,
  INSTAGRAM_REELS_TAB_DATA,
  InstagramReelTile,
  type InstagramReelItem,
  type InstagramReelsTabProps,
  instagramReelItemKeyExtractor,
  INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE,
  SyncedLegendList,
} from "../shared";

export const ReelsTab = ({
  imageSize,
  reelHeight,
  index,
  width,
}: InstagramReelsTabProps) => {
  const renderItem = React.useCallback(
    ({
      item,
      index: itemIndex,
    }: LegendListRenderItemProps<InstagramReelItem>) => (
      <InstagramReelTile
        item={item}
        itemIndex={itemIndex}
        imageSize={imageSize}
        reelHeight={reelHeight}
        style={getInstagramItemSpacingStyle(itemIndex)}
      />
    ),
    [imageSize, reelHeight],
  );

  return (
    <SyncedLegendList
      index={index}
      width={width}
      data={INSTAGRAM_REELS_TAB_DATA}
      numColumns={INSTAGRAM_NUM_COLUMNS}
      renderItem={renderItem}
      keyExtractor={instagramReelItemKeyExtractor}
      contentContainerStyle={INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE}
      maintainVisibleContentPosition={false}
      recycleItems
      estimatedItemSize={reelHeight}
      getFixedItemSize={() => reelHeight}
      showsVerticalScrollIndicator={false}
    />
  );
};
