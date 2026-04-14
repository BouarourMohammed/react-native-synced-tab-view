import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import {
  SyncedTabsLayout,
  type TabItem,
  type TabPageProps,
} from "react-native-synced-tab-view";

import { GridTab } from "@/components/instagram/profile-tab-flash-list/components/tab1";
import { ReelsTab } from "@/components/instagram/profile-tab-flash-list/components/tab2";
import { TaggedTab } from "@/components/instagram/profile-tab-flash-list/components/tab3";
import {
  createInstagramTopTabsProps,
  INSTAGRAM_PROFILE_HIGHLIGHTS,
  INSTAGRAM_PROFILE_STATS,
  INSTAGRAM_PROFILE_USERNAME,
  INSTAGRAM_SCROLLER_CONTAINER_STYLE,
  styles,
  useInstagramLayoutMetrics,
} from "@/components/instagram/profile-tab-flash-list/components/shared";

const InstagramHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerBar}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>
      <View style={styles.headerCenter}>
        <Text style={styles.headerUsername}>{INSTAGRAM_PROFILE_USERNAME}</Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color="#000"
          style={styles.headerChevron}
        />
      </View>
      <View style={styles.headerRight}>
        <Ionicons
          name="add-circle-outline"
          size={26}
          color="#000"
          style={styles.headerActionIcon}
        />
        <Ionicons name="menu-outline" size={26} color="#000" />
      </View>
    </View>
  );
};

const InstagramProfileTopSection = () => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.profileRow}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {INSTAGRAM_PROFILE_STATS.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.displayName}>Jane Designer</Text>
        <Text style={styles.bioCategory}>Digital creator</Text>
        <Text style={styles.bioText}>
          UI/UX Designer & Creative Director{"\n"}
          Building beautiful digital experiences ✨{"\n"}
          📍 San Francisco, CA
        </Text>
        <Pressable>
          <Text style={styles.bioLink}>www.janedesigner.com</Text>
        </Pressable>
      </View>

      <View style={styles.highlightsRow}>
        {INSTAGRAM_PROFILE_HIGHLIGHTS.map((highlight) => (
          <View key={highlight.label} style={styles.highlightItem}>
            <View style={styles.highlightCircle}>
              <Ionicons name={highlight.icon} size={22} color="#262626" />
            </View>
            <Text style={styles.highlightLabel}>{highlight.label}</Text>
          </View>
        ))}
        <View style={styles.highlightItem}>
          <View style={[styles.highlightCircle, styles.highlightNew]}>
            <Ionicons name="add" size={26} color="#c7c7c7" />
          </View>
          <Text style={styles.highlightLabel}>New</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Edit profile</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Share profile</Text>
        </Pressable>
        <Pressable style={styles.actionButtonSmall}>
          <Ionicons name="person-add-outline" size={16} color="#262626" />
        </Pressable>
      </View>
    </View>
  );
};

export default function InstagramProfileTabFlashListScreen() {
  const { imageSize, reelHeight, tabSlotWidth } = useInstagramLayoutMetrics();

  const topTabsProps = React.useMemo(
    () => createInstagramTopTabsProps(tabSlotWidth),
    [tabSlotWidth],
  );

  const tabs = React.useMemo(
    () =>
      [
        {
          key: "posts",
          name: "Posts",
          icon: "grid-outline",
          component: (props: TabPageProps) => (
            <GridTab {...props} imageSize={imageSize} />
          ),
        },
        {
          key: "reels",
          name: "Reels",
          icon: "play-circle-outline",
          component: (props: TabPageProps) => (
            <ReelsTab
              {...props}
              imageSize={imageSize}
              reelHeight={reelHeight}
            />
          ),
        },
        {
          key: "tagged",
          name: "Tagged",
          icon: "person-outline",
          component: (props: TabPageProps) => (
            <TaggedTab {...props} imageSize={imageSize} />
          ),
        },
      ] satisfies TabItem[],
    [imageSize, reelHeight],
  );

  return (
    <View style={styles.container}>
      <InstagramHeader />
      <SyncedTabsLayout
        header={<InstagramProfileTopSection />}
        tabs={tabs}
        initialTabIndex={0}
        topTabsProps={topTabsProps}
        scrollerContainerProps={{ style: INSTAGRAM_SCROLLER_CONTAINER_STYLE }}
      />
    </View>
  );
}
