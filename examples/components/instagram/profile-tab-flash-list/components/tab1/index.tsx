import * as React from "react";
import { type ListRenderItemInfo } from "@shopify/flash-list";

import {
  getInstagramItemSpacingStyle,
  INSTAGRAM_NUM_COLUMNS,
  INSTAGRAM_POSTS_TAB_DATA,
  InstagramGridTile,
  type InstagramGridItem,
  type InstagramGridTabProps,
  instagramGridItemKeyExtractor,
  INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE,
  SyncedFlashList,
} from "../shared";

export const GridTab = ({ imageSize, index, width }: InstagramGridTabProps) => {
  const renderItem = React.useCallback(
    ({
      item,
      index: itemIndex,
      target,
    }: ListRenderItemInfo<InstagramGridItem>) => (
      <InstagramGridTile
        item={item}
        itemIndex={itemIndex}
        imageSize={imageSize}
        style={getInstagramItemSpacingStyle(itemIndex)}
        isMeasurementPass={target === "Measurement"}
      />
    ),
    [imageSize],
  );

  return (
    <SyncedFlashList
      index={index}
      width={width}
      data={INSTAGRAM_POSTS_TAB_DATA}
      numColumns={INSTAGRAM_NUM_COLUMNS}
      renderItem={renderItem}
      keyExtractor={instagramGridItemKeyExtractor}
      contentContainerStyle={INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE}
      showsVerticalScrollIndicator={false}
    />
  );
};
