import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import {
  SyncedTabsLayout,
  type TabItem,
  type TabPageProps,
} from "react-native-synced-tab-view";

import { LikedTabScene } from "@/components/tiktok-profile/tab2";
import { SavedCollectionsTab } from "@/components/tiktok-profile/tab3";
import { VideosTabScene } from "@/components/tiktok-profile/tab1";
import {
  HEADER_NOTIFICATION_ICON_STYLE,
  PROFILE_HANDLE,
  PROFILE_STATS,
  styles,
  TIKTOK_SCROLLER_STYLE,
  TIKTOK_TOP_TABS_PROPS,
} from "@/components/tiktok-profile/shared";

const TikTokHeaderBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerBar}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>
      <Text style={styles.headerUsername}>{PROFILE_HANDLE}</Text>
      <View style={styles.headerRight}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color="#fff"
          style={HEADER_NOTIFICATION_ICON_STYLE}
        />
        <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
      </View>
    </View>
  );
};

const TikTokProfileHeader = () => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={44} color="#888" />
        </View>
      </View>
      <Text style={styles.handle}>{PROFILE_HANDLE}</Text>
      <View style={styles.statsRow}>
        {PROFILE_STATS.map((stat, index) => (
          <React.Fragment key={stat.label}>
            {index > 0 ? <View style={styles.statDivider} /> : null}
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
      <View style={styles.actionRow}>
        <Pressable style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </Pressable>
        <Pressable style={styles.messageButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
        </Pressable>
        <Pressable style={styles.addFriendButton}>
          <Ionicons name="person-add-outline" size={16} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.bioSection}>
        <Text style={styles.bioText}>
          Content creator and digital artist{"\n"}
          Building bold social-first visuals{"\n"}
          collab@creativealex.com
        </Text>
      </View>
    </View>
  );
};

const tiktokTabs = [
  {
    key: "videos",
    name: "Videos",
    icon: "grid-outline",
    component: (props: TabPageProps) => <VideosTabScene {...props} />,
  },
  {
    key: "liked",
    name: "Liked",
    icon: "heart-outline",
    component: (props: TabPageProps) => <LikedTabScene {...props} />,
  },
  {
    key: "saved",
    name: "Saved",
    icon: "bookmark-outline",
    component: (props: TabPageProps) => <SavedCollectionsTab {...props} />,
  },
] satisfies TabItem[];

export default function TikTokProfileScreen() {
  return (
    <View style={styles.container}>
      <TikTokHeaderBar />
      <SyncedTabsLayout
        header={<TikTokProfileHeader />}
        tabs={tiktokTabs}
        initialTabIndex={0}
        topTabsProps={TIKTOK_TOP_TABS_PROPS}
        scrollerContainerProps={{ style: TIKTOK_SCROLLER_STYLE }}
      />
    </View>
  );
}
