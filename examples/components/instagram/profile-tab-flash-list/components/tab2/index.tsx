import * as React from "react";
import { type ListRenderItemInfo } from "@shopify/flash-list";

import {
  getInstagramItemSpacingStyle,
  INSTAGRAM_NUM_COLUMNS,
  INSTAGRAM_REELS_TAB_DATA,
  InstagramReelTile,
  type InstagramReelItem,
  type InstagramReelsTabProps,
  instagramReelItemKeyExtractor,
  INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE,
  SyncedFlashList,
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
      target,
    }: ListRenderItemInfo<InstagramReelItem>) => (
      <InstagramReelTile
        item={item}
        itemIndex={itemIndex}
        imageSize={imageSize}
        reelHeight={reelHeight}
        style={getInstagramItemSpacingStyle(itemIndex)}
        isMeasurementPass={target === "Measurement"}
      />
    ),
    [imageSize, reelHeight],
  );

  return (
    <SyncedFlashList
      index={index}
      width={width}
      data={INSTAGRAM_REELS_TAB_DATA}
      numColumns={INSTAGRAM_NUM_COLUMNS}
      renderItem={renderItem}
      keyExtractor={instagramReelItemKeyExtractor}
      contentContainerStyle={INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE}
      showsVerticalScrollIndicator={false}
    />
  );
};
