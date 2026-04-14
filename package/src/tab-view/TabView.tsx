import * as React from "react";
import { TopTabs } from "./TopTabs";
import HBScroller from "./HBScroller";
import type {
  HBScrollerProps,
} from "./HBScroller";
import type {
  TabItem,
  TabPageProps,
  TopTabItemRenderProps,
  TopTabsProps,
} from "./TopTabs";

// ─── TopTabs‑specific props (everything except `tabs` & `width`) ────────────

export type TabViewTopTabsProps = Omit<TopTabsProps, "tabs" | "width">;

// ─── HBScroller‑specific props (everything except `tabs`, `width`, & `initialTabIndex`) ─

export type TabViewScrollerProps = Omit<
  HBScrollerProps,
  "tabs" | "width" | "initialTabIndex"
>;

// ─── TabView Props ──────────────────────────────────────────────────────────

export interface TabViewProps {
  /** Tab definitions (shared between TopTabs and HBScroller) */
  tabs: TabItem[];
  /** Width of the tab bar and each page (default: screen width) */
  width?: number;
  /** The tab to display on first mount — synced between TopTabs & HBScroller (default: 0) */
  initialTabIndex?: number;
  /** Customisation props forwarded to TopTabs */
  topTabsProps?: TabViewTopTabsProps;
  /** Customisation props forwarded to HBScroller */
  scrollerProps?: TabViewScrollerProps;
}

export type { TabItem, TabPageProps, TopTabItemRenderProps };

/**
 * A pre‑wired combination of `TopTabs` + `HBScroller` that keeps shared
 * props (`tabs`, `width`, `initialTabIndex`) in sync between both children
 * without extra `useEffect` calls.
 *
 * All visual/behavioural customisation for the tab bar and scroller is still
 * available via `topTabsProps` and `scrollerProps`.
 */
const TabView: React.FC<TabViewProps> = ({
  tabs,
  width,
  initialTabIndex = 0,
  topTabsProps = {},
  scrollerProps = {},
}) => {
  const {
    initialNumToRender: scrollerInitialNumToRender = 1,
    ...restScrollerProps
  } = scrollerProps;

  // Ensure HBScroller renders enough items so the initialScrollIndex is reachable
  const safeInitialNumToRender = Math.max(
    scrollerInitialNumToRender,
    initialTabIndex + 1,
  );

  return (
    <>
      <TopTabs tabs={tabs} width={width} {...topTabsProps} />
      <HBScroller
        tabs={tabs}
        width={width}
        initialTabIndex={initialTabIndex}
        {...restScrollerProps}
        initialNumToRender={safeInitialNumToRender}
      />
    </>
  );
};

export default TabView;
