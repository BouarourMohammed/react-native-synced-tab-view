import * as React from "react";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

import type { BaseTabPageProps } from "../shared";
import {
  COLORS,
  FEED_PAGE_SIZE,
  FEED_TOTAL_PAGES,
  LIST_CONTENT_CONTAINER_STYLE,
  SIMULATED_API_DELAY_MS,
  SyncedFlashList,
  styles,
} from "../shared";

const FEED_CATEGORIES = [
  "Fresh",
  "Layout",
  "Motion",
  "Testing",
  "Ideas",
  "Updates",
];

const FEED_SUMMARIES = [
  "Each item is appended from a simulated API request so you can keep scrolling and watch the synced header behavior.",
  "This example keeps the content lightweight and readable while new rows arrive with a delayed response.",
  "The goal here is to test real list growth without filling the UI with debug-style text.",
  "More items are fetched when you reach the end, which makes it easier to verify tab height updates.",
  "This batch is generated locally, but it behaves like a remote paginated feed with a short wait.",
  "The first tab now matches the simpler tone used by the other examples in this app.",
];

type FeedItemData = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  accentColor: string;
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const createFeedPageItems = (page: number): FeedItemData[] =>
  new Array(FEED_PAGE_SIZE).fill(0).map((_, itemIndex) => {
    const absoluteIndex = (page - 1) * FEED_PAGE_SIZE + itemIndex + 1;
    const category = FEED_CATEGORIES[absoluteIndex % FEED_CATEGORIES.length];
    const subtitle =
      FEED_SUMMARIES[absoluteIndex % FEED_SUMMARIES.length];

    return {
      id: `feed-${page}-${absoluteIndex}`,
      category,
      title: `Item ${absoluteIndex}`,
      subtitle,
      accentColor: COLORS[absoluteIndex % COLORS.length],
    };
  });

const fetchFeedPage = async (page: number) => {
  await wait(SIMULATED_API_DELAY_MS);

  return {
    items: createFeedPageItems(page),
    hasNextPage: page < FEED_TOTAL_PAGES,
  };
};

const FeedCard = React.memo(({ item }: { item: FeedItemData }) => (
  <View style={styles.feedCard}>
    <View
      style={[styles.feedCardAccent, { backgroundColor: item.accentColor }]}
    />
    <View style={styles.feedCardBody}>
      <Text style={styles.feedCategory}>{item.category}</Text>
      <Text style={styles.feedCardTitle}>{item.title}</Text>
      <Text style={styles.feedCardSubtitle}>{item.subtitle}</Text>
    </View>
  </View>
));
FeedCard.displayName = "FeedCard";

const FeedFooter = React.memo(
  ({
    hasNextPage,
    isFetchingNextPage,
  }: {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
  }) => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.feedFooter}>
          <ActivityIndicator size="small" color="#6C5CE7" />
          <Text style={styles.feedFooterText}>Loading more content...</Text>
        </View>
      );
    }

    if (!hasNextPage) {
      return (
        <View style={styles.feedFooter}>
          <Text style={styles.feedFooterDoneText}>End of the demo feed.</Text>
        </View>
      );
    }

    return <View style={styles.feedFooterSpacer} />;
  },
);
FeedFooter.displayName = "FeedFooter";

const FeedInitialState = React.memo(() => (
  <View style={styles.feedInitialState}>
    <ActivityIndicator size="small" color="#6C5CE7" />
    <Text style={styles.feedInitialTitle}>Loading the first batch...</Text>
    <Text style={styles.feedInitialSubtitle}>
      {`This tab simulates a paginated API with a ${SIMULATED_API_DELAY_MS / 1000}-second delay. Scroll to the end to fetch more rows.`}
    </Text>
  </View>
));
FeedInitialState.displayName = "FeedInitialState";

export const FeedTab = ({ index, width }: BaseTabPageProps) => {
  const [items, setItems] = React.useState<FeedItemData[]>([]);
  const [nextPage, setNextPage] = React.useState(1);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);
  const mountedRef = React.useRef(true);
  const requestInFlightRef = React.useRef<number | null>(null);
  const initialLoadStartedRef = React.useRef(false);

  React.useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadPage = React.useCallback(
    async (page: number, mode: "replace" | "append") => {
      if (requestInFlightRef.current !== null) {
        return;
      }

      requestInFlightRef.current = page;

      if (mode === "replace") {
        setIsInitialLoading(true);
      } else {
        setIsFetchingNextPage(true);
      }

      try {
        const response = await fetchFeedPage(page);

        if (!mountedRef.current) {
          return;
        }

        setItems((currentItems) =>
          mode === "replace"
            ? response.items
            : [...currentItems, ...response.items],
        );
        setNextPage(page + 1);
        setHasNextPage(response.hasNextPage);
      } finally {
        requestInFlightRef.current = null;

        if (!mountedRef.current) {
          return;
        }

        if (mode === "replace") {
          setIsInitialLoading(false);
        } else {
          setIsFetchingNextPage(false);
        }
      }
    },
    [],
  );

  React.useEffect(() => {
    if (initialLoadStartedRef.current) {
      return;
    }

    initialLoadStartedRef.current = true;
    void loadPage(1, "replace");
  }, [loadPage]);

  const handleEndReached = React.useCallback(() => {
    if (isInitialLoading || isFetchingNextPage || !hasNextPage) {
      return;
    }

    void loadPage(nextPage, "append");
  }, [hasNextPage, isFetchingNextPage, isInitialLoading, loadPage, nextPage]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<FeedItemData>) => <FeedCard item={item} />,
    [],
  );

  const renderFooter = React.useCallback(
    () => (
      <FeedFooter
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    ),
    [hasNextPage, isFetchingNextPage],
  );

  const renderEmptyState = React.useCallback(
    () => (isInitialLoading ? <FeedInitialState /> : null),
    [isInitialLoading],
  );

  return (
    <SyncedFlashList
      index={index}
      data={items}
      width={width}
      contentContainerStyle={LIST_CONTENT_CONTAINER_STYLE}
      renderItem={renderItem}
      keyExtractor={(item: FeedItemData) => item.id}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.35}
      showsVerticalScrollIndicator={false}
    />
  );
};
