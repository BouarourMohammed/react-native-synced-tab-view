import * as React from "react";
import {
  ScrollViewProps as RNScrollViewProps,
  ScrollView as RNScrollView,
} from "react-native";
import { createSyncedTabScrollComponent } from "../factory/createSyncedTabScrollComponent";

export interface TabScrollViewProps extends RNScrollViewProps {
  index: number;
  width?: number;
  children?: React.ReactNode;
}

const InternalTabScrollView = createSyncedTabScrollComponent<RNScrollViewProps>(
  RNScrollView as unknown as React.ComponentType<any>,
);

const TabScrollView = (props: TabScrollViewProps) => {
  return <InternalTabScrollView {...(props as any)} />;
};

export default TabScrollView;
