import * as React from "react";
import {
  FlashList as RNFlashList,
  type FlashListProps as RNFlashListProps,
} from "@shopify/flash-list";
import { createSyncedTabScrollComponent } from "react-native-synced-tab-view";

export * from "../../shared";
export const INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE = {
  paddingBottom: 2,
};

type SyncedFlashListProps<T> = RNFlashListProps<T> & {
  index: number;
  width?: number;
};

type SyncedFlashListRef = React.ComponentRef<typeof RNFlashList>;

const InternalSyncedFlashList = createSyncedTabScrollComponent<
  RNFlashListProps<any>,
  SyncedFlashListRef
>(RNFlashList as unknown as React.ComponentType<any>);

type SyncedFlashListComponent = <T,>(
  props: SyncedFlashListProps<T> & React.RefAttributes<SyncedFlashListRef>,
) => React.ReactElement | null;

const SyncedFlashListInner = <T,>(
  props: SyncedFlashListProps<T>,
  ref: React.ForwardedRef<SyncedFlashListRef>,
) => {
  return <InternalSyncedFlashList {...(props as any)} ref={ref} />;
};

const ForwardedSyncedFlashList = React.forwardRef(SyncedFlashListInner);
ForwardedSyncedFlashList.displayName = "InstagramExampleSyncedFlashList";

export const SyncedFlashList =
  ForwardedSyncedFlashList as SyncedFlashListComponent;
