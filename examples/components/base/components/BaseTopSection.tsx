import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { styles } from "./shared";

const EXTRA_DETAILS = [
  {
    id: "delay",
    title: "2-second delay",
    description:
      "Each new page waits before appending so you can inspect scroll behavior more clearly.",
    icon: "time-outline" as const,
    color: "#6C5CE7",
  },
  {
    id: "pagination",
    title: "Infinite pagination",
    description:
      "The first tab fetches another page at the end of the list to simulate a real API feed.",
    icon: "albums-outline" as const,
    color: "#00B894",
  },
];

type BaseTopSectionProps = {
  title?: string;
  subtitle?: string;
};

export const BaseTopSection = ({
  title = "Dynamic Top Section",
  subtitle = "This area collapses as you scroll down. Tap the button to add dynamic content and see how the layout adapts.",
}: BaseTopSectionProps) => {
  const [showMore, setShowMore] = React.useState(false);

  return (
    <View style={styles.topSection}>
      <Text style={styles.topTitle}>{title}</Text>
      <Text style={styles.topSubtitle}>{subtitle}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.detailsToggleButton,
          pressed && styles.detailsToggleButtonPressed,
        ]}
        onPress={() => setShowMore(!showMore)}
      >
        <Text style={styles.detailsToggleButtonText}>
          {showMore ? "Hide Details" : "Show Details"}
        </Text>
      </Pressable>

      {showMore && (
        <View style={styles.extraContent}>
          {EXTRA_DETAILS.map((detail) => (
            <View key={detail.id} style={styles.extraCard}>
              <View
                style={[styles.extraCardIcon, { backgroundColor: detail.color }]}
              >
                <Ionicons name={detail.icon} size={18} color="#fff" />
              </View>
              <View style={styles.extraCardBody}>
                <Text style={styles.extraCardTitle}>{detail.title}</Text>
                <Text style={styles.extraCardDescription}>
                  {detail.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
