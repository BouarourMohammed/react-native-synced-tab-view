import * as React from "react";
import { type LegendListRenderItemProps } from "@legendapp/list";

import {
  getInstagramItemSpacingStyle,
  INSTAGRAM_NUM_COLUMNS,
  INSTAGRAM_TAGGED_TAB_DATA,
  InstagramTaggedTile,
  type InstagramGridItem,
  type InstagramGridTabProps,
  instagramGridItemKeyExtractor,
  INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE,
  SyncedLegendList,
} from "../shared";

export const TaggedTab = ({ imageSize, index, width }: InstagramGridTabProps) => {
  const renderItem = React.useCallback(
    ({
      item,
      index: itemIndex,
    }: LegendListRenderItemProps<InstagramGridItem>) => (
      <InstagramTaggedTile
        item={item}
        itemIndex={itemIndex}
        imageSize={imageSize}
        style={getInstagramItemSpacingStyle(itemIndex)}
      />
    ),
    [imageSize],
  );

  return (
    <SyncedLegendList
      index={index}
      width={width}
      data={INSTAGRAM_TAGGED_TAB_DATA}
      numColumns={INSTAGRAM_NUM_COLUMNS}
      renderItem={renderItem}
      keyExtractor={instagramGridItemKeyExtractor}
      contentContainerStyle={INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE}
      maintainVisibleContentPosition={false}
      recycleItems
      estimatedItemSize={imageSize}
      getFixedItemSize={() => imageSize}
      showsVerticalScrollIndicator={false}
    />
  );
};
