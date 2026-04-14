import * as React from "react";
import {
  SectionList as RNSectionList,
  type SectionListProps as RNSectionListProps,
} from "react-native";
import { createSyncedTabScrollComponent } from "../factory/createSyncedTabScrollComponent";

export interface TabSectionListProps<
  ItemT,
  SectionT = Record<string, unknown>,
> extends Omit<RNSectionListProps<ItemT, SectionT>, "windowSize"> {
  index: number;
  width?: number;
}

type InternalTabSectionListProps<
  ItemT,
  SectionT = Record<string, unknown>,
> = TabSectionListProps<ItemT, SectionT> & {
  windowSize?: RNSectionListProps<ItemT, SectionT>["windowSize"];
};

const InternalTabSectionList = createSyncedTabScrollComponent<
  RNSectionListProps<any, any>
>(RNSectionList as unknown as React.ComponentType<any>);

const TabSectionList = <ItemT, SectionT = Record<string, unknown>>(
  props: TabSectionListProps<ItemT, SectionT>,
) => {
  const { windowSize: _windowSize, ...rest } =
    props as InternalTabSectionListProps<ItemT, SectionT>;

  return <InternalTabSectionList {...(rest as any)} />;
};

export default TabSectionList;
