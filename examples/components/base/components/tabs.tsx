import {
  type TabItem,
  type TabPageProps,
} from "react-native-synced-tab-view";

import { FeedTab } from "./tab1";
import { ListTab } from "./tab2";
import { GridTab } from "./tab3";
import { SectionTab } from "./tab4";
import { HorizontalScrollerTab } from "./tab5";
import { ShortContentTab } from "./tab6";

export const BASE_EXAMPLE_TABS = [
  {
    key: "feed",
    name: "Feed",
    component: ({ index, width }: TabPageProps) => (
      <FeedTab index={index} width={width} />
    ),
  },
  {
    key: "list",
    name: "List",
    component: ({ index, width }: TabPageProps) => (
      <ListTab index={index} width={width} />
    ),
  },
  {
    key: "grid-alt",
    name: "Grid Alt",
    component: ({ index, width }: TabPageProps) => (
      <GridTab index={index} width={width} />
    ),
  },
  {
    key: "section-list",
    name: "Sections",
    component: ({ index, width }: TabPageProps) => (
      <SectionTab index={index} width={width} />
    ),
  },
  {
    key: "horizontal-scroller",
    name: "Scroller",
    component: ({ index, width }: TabPageProps) => (
      <HorizontalScrollerTab index={index} width={width} />
    ),
  },
  {
    key: "short",
    name: "Short",
    component: ({ index, width }: TabPageProps) => (
      <ShortContentTab index={index} width={width} />
    ),
  },
] satisfies TabItem[];
