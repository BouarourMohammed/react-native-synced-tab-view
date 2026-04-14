import * as React from "react";
import {
  LegendList as RNLegendList,
  type LegendListProps as RNLegendListProps,
  type LegendListRef as RNLegendListRef,
} from "@legendapp/list";
import { createSyncedTabScrollComponent } from "react-native-synced-tab-view";

export * from "../../shared";
export const INSTAGRAM_TAB_CONTENT_CONTAINER_STYLE = {
  paddingBottom: 2,
};

type SyncedLegendListProps<T> = RNLegendListProps<T> & {
  index: number;
  width?: number;
};

type SyncedLegendListRef = RNLegendListRef;

const InternalSyncedLegendList = createSyncedTabScrollComponent<
  RNLegendListProps<any>,
  SyncedLegendListRef
>(RNLegendList as unknown as React.ComponentType<any>);

type SyncedLegendListComponent = <T>(
  props: SyncedLegendListProps<T> & React.RefAttributes<SyncedLegendListRef>,
) => React.ReactElement | null;

const SyncedLegendListInner = <T,>(
  props: SyncedLegendListProps<T>,
  ref: React.ForwardedRef<SyncedLegendListRef>,
) => {
  return <InternalSyncedLegendList {...(props as any)} ref={ref} />;
};

const ForwardedSyncedLegendList = React.forwardRef(SyncedLegendListInner);
ForwardedSyncedLegendList.displayName = "InstagramResetFalseSyncedLegendList";

export const SyncedLegendList =
  ForwardedSyncedLegendList as SyncedLegendListComponent;
