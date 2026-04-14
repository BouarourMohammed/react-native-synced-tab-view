import { View } from "react-native";
import { SyncedTabsLayout } from "react-native-synced-tab-view";

import { BaseHeader } from "@/components/base/components/BaseHeader";
import { BaseTopSection } from "@/components/base/components/BaseTopSection";
import { BASE_TOP_TABS_PROPS, styles } from "@/components/base/components/shared";
import { BASE_EXAMPLE_TABS } from "@/components/base/components/tabs";

const BaseExample = () => {
  return (
    <View style={styles.container}>
      <BaseHeader />
      <SyncedTabsLayout
        header={<BaseTopSection />}
        tabs={BASE_EXAMPLE_TABS}
        initialTabIndex={0}
        topTabsProps={BASE_TOP_TABS_PROPS}
      />
    </View>
  );
};

export default BaseExample;
