import { Text, View } from "react-native";
import { TabScrollView } from "react-native-synced-tab-view";

import type { BaseTabPageProps } from "../shared";
import { styles } from "../shared";

export const ShortContentTab = ({ index, width }: BaseTabPageProps) => {
  return (
    <TabScrollView index={index} width={width}>
      <View style={styles.shortTabCard}>
        <Text style={styles.shortTabTitle}>200px Content</Text>
        <Text style={styles.shortTabSubtitle}>
          This tab intentionally keeps its content height short to verify that
          the container sizing is calculated from the measured content.
        </Text>
      </View>
    </TabScrollView>
  );
};
