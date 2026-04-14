import * as React from "react";
import { TabFlatList } from "react-native-synced-tab-view";

import {
  INSTAGRAM_GRID_COLUMN_WRAPPER_STYLE,
  INSTAGRAM_GRID_CONTENT_CONTAINER_STYLE,
  INSTAGRAM_MEDIA_INITIAL_NUM_TO_RENDER,
  INSTAGRAM_NUM_COLUMNS,
  INSTAGRAM_REELS_TAB_DATA,
  InstagramReelTile,
  type InstagramReelItem,
  type InstagramReelsTabProps,
  instagramReelItemKeyExtractor,
  INSTAGRAM_GRID_GAP,
} from "../shared";

export const ReelsTab = ({
  index,
  width,
  imageSize,
  reelHeight,
}: InstagramReelsTabProps) => {
  const getItemLayout = React.useCallback(
    (
      _data: ArrayLike<InstagramReelItem> | null | undefined,
      itemIndex: number,
    ) => ({
      length: reelHeight,
      offset:
        Math.floor(itemIndex / INSTAGRAM_NUM_COLUMNS) *
        (reelHeight + INSTAGRAM_GRID_GAP),
      index: itemIndex,
    }),
    [reelHeight],
  );

  const renderItem = React.useCallback(
    ({
      item,
      index: itemIndex,
    }: {
      item: InstagramReelItem;
      index: number;
    }) => (
      <InstagramReelTile
        item={item}
        itemIndex={itemIndex}
        imageSize={imageSize}
        reelHeight={reelHeight}
      />
    ),
    [imageSize, reelHeight],
  );

  return (
    <TabFlatList
      index={index}
      width={width}
      data={INSTAGRAM_REELS_TAB_DATA}
      numColumns={INSTAGRAM_NUM_COLUMNS}
      columnWrapperStyle={INSTAGRAM_GRID_COLUMN_WRAPPER_STYLE}
      contentContainerStyle={INSTAGRAM_GRID_CONTENT_CONTAINER_STYLE}
      getItemLayout={getItemLayout}
      initialNumToRender={INSTAGRAM_MEDIA_INITIAL_NUM_TO_RENDER}
      renderItem={renderItem}
      keyExtractor={instagramReelItemKeyExtractor}
    />
  );
};
