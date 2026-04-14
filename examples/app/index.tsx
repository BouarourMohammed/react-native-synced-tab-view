import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type ExampleScreenGroup =
  | "Basic"
  | "Custom Header Tabs UI"
  | "FlashList Adapter"
  | "LegendList Adapter";

type ExampleScreenItem = {
  group: ExampleScreenGroup;
  link: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

type ExampleScreenSection = {
  title: ExampleScreenGroup;
  data: ExampleScreenItem[];
};

const EXAMPLE_SCREENS: readonly ExampleScreenItem[] = [
  {
    group: "Basic",
    link: "base/index",
    name: "Basic Setup",
    description: "Start here for the default synced tabs layout pattern",
    icon: "layers-outline",
    color: "#6C5CE7",
  },
  {
    group: "Basic",
    link: "base/keep-position/index",
    name: "Basic Keep Position",
    description: "Same base demo, but each tab restores its last scroll position",
    icon: "bookmark-outline",
    color: "#00B894",
  },
  {
    group: "Custom Header Tabs UI",
    link: "tiktok/profile/index",
    name: "TikTok Header Tabs",
    description: "Custom tab icons and a profile-style header layout",
    icon: "logo-tiktok",
    color: "#010101",
  },
  {
    group: "Custom Header Tabs UI",
    link: "instagram/profile/index",
    name: "Instagram Header Tabs",
    description: "Custom tab bar UI with built-in package tab lists",
    icon: "logo-instagram",
    color: "#E1306C",
  },
  {
    group: "FlashList Adapter",
    link: "instagram/profile-tab-flash-list/index",
    name: "FlashList Adapter",
    description: "Adapts FlashList with createSyncedTabScrollComponent",
    icon: "flash-outline",
    color: "#FB7185",
  },
  {
    group: "LegendList Adapter",
    link: "instagram/profile-tab-legend-list/index",
    name: "LegendList Adapter",
    description: "Adapts LegendList with createSyncedTabScrollComponent",
    icon: "logo-instagram",
    color: "#10B981",
  },
  {
    group: "LegendList Adapter",
    link: "instagram/profile-reset-false/index",
    name: "LegendList Keep Position",
    description: "LegendList adapter variant with saved per-tab scroll state",
    icon: "logo-instagram",
    color: "#C13584",
  },
];

const EXAMPLE_SCREEN_GROUP_ORDER: readonly ExampleScreenGroup[] = [
  "Basic",
  "Custom Header Tabs UI",
  "FlashList Adapter",
  "LegendList Adapter",
];

const EXAMPLE_SCREEN_SECTIONS: readonly ExampleScreenSection[] =
  EXAMPLE_SCREEN_GROUP_ORDER.map((title) => ({
    title,
    data: EXAMPLE_SCREENS.filter((screen) => screen.group === title),
  }));

type ExampleScreenCardProps = {
  item: ExampleScreenItem;
  onNavigate: (link: ExampleScreenItem["link"]) => void;
};

const ExampleScreenCard = React.memo(
  ({ item, onNavigate }: ExampleScreenCardProps) => {
    const { link, name, description, icon, color } = item;

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => onNavigate(link)}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={28} color="#fff" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#c7c7c7" />
      </Pressable>
    );
  },
);

ExampleScreenCard.displayName = "ExampleScreenCard";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const onNavigate = React.useCallback(
    (link: ExampleScreenItem["link"]) => {
      navigation.navigate(link);
    },
    [navigation],
  );

  const renderScreenItem = React.useCallback(
    ({ item }: { item: ExampleScreenItem }) => (
      <ExampleScreenCard item={item} onNavigate={onNavigate} />
    ),
    [onNavigate],
  );

  const keyExtractor = React.useCallback(
    (item: ExampleScreenItem) => item.link,
    [],
  );

  const renderSectionHeader = React.useCallback(
    ({ section }: { section: ExampleScreenSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    [],
  );

  const renderItemSeparator = React.useCallback(
    () => <View style={styles.itemSeparator} />,
    [],
  );

  const renderSectionSeparator = React.useCallback(
    () => <View style={styles.sectionSeparator} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Ready to Use</Text>
        <Text style={styles.subtitle}>Examples grouped by purpose</Text>
      </View>
      <SectionList
        sections={EXAMPLE_SCREEN_SECTIONS as ExampleScreenSection[]}
        renderItem={renderScreenItem}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={renderItemSeparator}
        SectionSeparatorComponent={renderSectionSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#8e8e93",
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 13,
    color: "#8e8e93",
    lineHeight: 18,
  },
  sectionHeader: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  itemSeparator: {
    height: 10,
  },
  sectionSeparator: {
    height: 10,
  },
});
