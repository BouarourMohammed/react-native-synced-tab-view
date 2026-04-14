import { View } from "react-native";
import { SyncedTabsLayout } from "react-native-synced-tab-view";

import { BaseHeader } from "@/components/base/components/BaseHeader";
import { BaseTopSection } from "@/components/base/components/BaseTopSection";
import { BASE_TOP_TABS_PROPS, styles } from "@/components/base/components/shared";
import { BASE_EXAMPLE_TABS } from "@/components/base/components/tabs";

const KEEP_POSITION_SUBTITLE =
  "This is the same base example, but each tab restores its last scroll position when you switch away and come back.";

const BaseKeepPositionExample = () => {
  return (
    <View style={styles.container}>
      <BaseHeader title="Base Keep Position" />
      <SyncedTabsLayout
        header={
          <BaseTopSection
            title="Dynamic Top Section"
            subtitle={KEEP_POSITION_SUBTITLE}
          />
        }
        tabs={BASE_EXAMPLE_TABS}
        initialTabIndex={0}
        topTabsProps={BASE_TOP_TABS_PROPS}
        tabsProviderProps={{ resetPreviousScrollingY: false }}
      />
    </View>
  );
};

export default BaseKeepPositionExample;
