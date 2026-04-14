import * as React from "react";
import { TabFlatList } from "react-native-synced-tab-view";

import {
  INSTAGRAM_GRID_COLUMN_WRAPPER_STYLE,
  INSTAGRAM_GRID_CONTENT_CONTAINER_STYLE,
  INSTAGRAM_MEDIA_INITIAL_NUM_TO_RENDER,
  INSTAGRAM_NUM_COLUMNS,
  INSTAGRAM_TAGGED_TAB_DATA,
  InstagramTaggedTile,
  type InstagramGridItem,
  type InstagramGridTabProps,
  instagramGridItemKeyExtractor,
  INSTAGRAM_GRID_GAP,
} from "../shared";

export const TaggedTab = ({
  index,
  width,
  imageSize,
}: InstagramGridTabProps) => {
  const getItemLayout = React.useCallback(
    (
      _data: ArrayLike<InstagramGridItem> | null | undefined,
      itemIndex: number,
    ) => ({
      length: imageSize,
      offset:
        Math.floor(itemIndex / INSTAGRAM_NUM_COLUMNS) *
        (imageSize + INSTAGRAM_GRID_GAP),
      index: itemIndex,
    }),
    [imageSize],
  );

  const renderItem = React.useCallback(
    ({
      item,
      index: itemIndex,
    }: {
      item: InstagramGridItem;
      index: number;
    }) => (
      <InstagramTaggedTile
        item={item}
        itemIndex={itemIndex}
        imageSize={imageSize}
      />
    ),
    [imageSize],
  );

  return (
    <TabFlatList
      index={index}
      width={width}
      data={INSTAGRAM_TAGGED_TAB_DATA}
      numColumns={INSTAGRAM_NUM_COLUMNS}
      columnWrapperStyle={INSTAGRAM_GRID_COLUMN_WRAPPER_STYLE}
      contentContainerStyle={INSTAGRAM_GRID_CONTENT_CONTAINER_STYLE}
      getItemLayout={getItemLayout}
      initialNumToRender={INSTAGRAM_MEDIA_INITIAL_NUM_TO_RENDER}
      renderItem={renderItem}
      keyExtractor={instagramGridItemKeyExtractor}
    />
  );
};
