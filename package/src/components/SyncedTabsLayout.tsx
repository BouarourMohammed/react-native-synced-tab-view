import * as React from "react";
import { TabsProvider } from "../internal/RefsContext";
import type { TabsProviderProps } from "../internal/RefsContext";
import TabView from "../tab-view";
import type { TabViewProps } from "../tab-view";
import ScrollerContainer from "./ScrollerContainer";
import type { ScrollerContainerProps } from "./ScrollerContainer";
import TopSection from "./TopSection";
import type { TopSectionProps } from "./TopSection";

export interface SyncedTabsLayoutProps extends TabViewProps {
  /**
   * Content rendered above the tabs and measured by the shared scroller.
   */
  header: React.ReactNode;
  /**
   * Optional props forwarded to TabsProvider for shared scroll behavior.
   */
  tabsProviderProps?: Omit<TabsProviderProps, "children">;
  /**
   * Optional props forwarded to the outer synchronized scroller.
   */
  scrollerContainerProps?: Omit<ScrollerContainerProps, "children">;
  /**
   * Optional props forwarded to the header measurement container.
   */
  headerContainerProps?: Omit<TopSectionProps, "children">;
}

const SyncedTabsLayout: React.FC<SyncedTabsLayoutProps> = ({
  header,
  tabsProviderProps,
  scrollerContainerProps,
  headerContainerProps,
  ...tabViewProps
}) => {
  return (
    <TabsProvider {...tabsProviderProps}>
      <ScrollerContainer {...scrollerContainerProps}>
        <TopSection {...headerContainerProps}>{header}</TopSection>
        <TabView {...tabViewProps} />
      </ScrollerContainer>
    </TabsProvider>
  );
};

export default SyncedTabsLayout;
