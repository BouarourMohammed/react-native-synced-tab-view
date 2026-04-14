import * as React from "react";
import {
  Text,
  View,
  type SectionListData as RNSectionListData,
} from "react-native";
import { TabSectionList } from "react-native-synced-tab-view";

import type { BaseTabPageProps } from "../shared";
import {
  COLORS,
  SECTION_LIST_CONTENT_CONTAINER_STYLE,
  styles,
} from "../shared";

type SectionListItemData = {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
};

type SectionListSection = RNSectionListData<
  SectionListItemData,
  {
    title: string;
    accentColor: string;
  }
>;

const SectionListItem = React.memo(
  ({ item }: { item: SectionListItemData }) => (
    <View style={styles.sectionListItem}>
      <View
        style={[
          styles.sectionListItemAccent,
          { backgroundColor: item.accentColor },
        ]}
      />
      <View style={styles.sectionListItemContent}>
        <Text style={styles.sectionListItemTitle}>{item.title}</Text>
        <Text style={styles.sectionListItemSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  ),
);
SectionListItem.displayName = "BaseSectionListItem";

const StickySectionHeader = React.memo(
  ({ section }: { section: SectionListSection }) => (
    <View style={styles.sectionListHeader}>
      <View
        style={[
          styles.sectionListHeaderAccent,
          { backgroundColor: section.accentColor },
        ]}
      />
      <View style={styles.sectionListHeaderCopy}>
        <Text style={styles.sectionListHeaderTitle}>{section.title}</Text>
        <Text style={styles.sectionListHeaderSubtitle}>
          Sticky header stays pinned while the tab scroll stays synced.
        </Text>
      </View>
    </View>
  ),
);
StickySectionHeader.displayName = "StickySectionHeader";

export const SectionTab = ({ index, width }: BaseTabPageProps) => {
  const sections = React.useMemo<SectionListSection[]>(
    () =>
      new Array(5).fill(0).map((_, sectionIndex) => ({
        title: `Section ${sectionIndex + 1}`,
        accentColor: COLORS[sectionIndex % COLORS.length],
        data: new Array(8).fill(0).map((__, itemIndex) => {
          const itemNumber = sectionIndex * 8 + itemIndex + 1;

          return {
            id: `section-${index}-${sectionIndex}-${itemIndex}`,
            title: `Row ${itemNumber}`,
            subtitle: `Pinned under ${sectionIndex + 1} while you scroll the content.`,
            accentColor: COLORS[(sectionIndex + itemIndex + 1) % COLORS.length],
          };
        }),
      })),
    [index],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: SectionListItemData }) => (
      <SectionListItem item={item} />
    ),
    [],
  );

  const renderSectionHeader = React.useCallback(
    ({ section }: { section: SectionListSection }) => (
      <StickySectionHeader section={section} />
    ),
    [],
  );

  return (
    <TabSectionList
      index={index}
      width={width}
      sections={sections}
      contentContainerStyle={SECTION_LIST_CONTENT_CONTAINER_STYLE}
      stickySectionHeadersEnabled
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item: SectionListItemData) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};
