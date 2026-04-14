import * as React from "react";
import {
  FlatList as RNFlatList,
  type FlatListProps as RNFlatListProps,
} from "react-native";
import { createSyncedTabScrollComponent } from "../factory/createSyncedTabScrollComponent";

export interface TabFlatListProps<T> extends Omit<
  RNFlatListProps<T>,
  "windowSize"
> {
  index: number;
  width?: number;
}

type InternalTabFlatListProps<T> = TabFlatListProps<T> & {
  windowSize?: RNFlatListProps<T>["windowSize"];
};

const InternalTabFlatList = createSyncedTabScrollComponent<
  RNFlatListProps<any>
>(RNFlatList as unknown as React.ComponentType<any>);

const TabFlatList = <T,>(props: TabFlatListProps<T>) => {
  const { windowSize: _windowSize, ...rest } =
    props as InternalTabFlatListProps<T>;

  return <InternalTabFlatList {...(rest as any)} />;
};

export default TabFlatList;
