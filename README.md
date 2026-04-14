# **react-native-synced-tab-view**

Synchronized top tabs with a measured, collapsible header for React Native. Build profile, feed, and dashboard layouts where horizontal paging and vertical scroll positions stay aligned across tabs.

<details>
<summary>iOS Demo 🍎</summary>

[Watch the iOS demo](https://youtube.com/shorts/H4it2s8ogyk?si=-_DIcP5ucugt3jh1)

</details>

## **⚡ Powered by Reanimated + Worklets**

This library uses `react-native-reanimated` and `react-native-worklets` to keep tab switching, header collapse, and scroll synchronization smooth across modern React Native apps.

* **Smooth shared-value driven interactions**: Active tab state and indicator movement are animated with Reanimated.
* **Synchronized scrolling**: Header and tab content offsets stay coordinated when users swipe between tabs.
* **Modern compatibility**: Built for current React Native projects using Reanimated `>= 4`.

## **✨ Features**

* **Collapsible Header Layout**: Render any header above your tabs and let the package measure and sync it automatically.
* **Synced Tab Content**: Keep vertical scroll state aligned while switching between tab pages.
* **Ready-to-use Scroll Wrappers**: Use `TabFlatList`, `TabSectionList`, and `TabScrollView` out of the box.
* **Custom List Support**: Wrap third-party scrollers like FlashList or Legend List with `createSyncedTabScrollComponent`.
* **Customizable Top Tabs**: Style the indicator, labels, colors, and even provide a fully custom `renderTabItem`.
* **Profile-style UI Friendly**: Designed for layouts like social profiles, dashboards, and content hubs.

## **🧩 Compatibility**

| Target | Supported Version |
| :---- | :---- |
| React Native | `>= 0.76` |
| React | `>= 18` |
| Reanimated | `>= 4` |
| React Native Worklets | `>= 0.7.0` |
| Android | Supported |
| iOS | Supported |
| Web | Not supported yet |

## **📦 Installation**

Install the package and its peer dependencies:

```bash
yarn add react-native-synced-tab-view react-native-reanimated react-native-worklets
```

### **Peer Dependency Setup**

Make sure your project is already configured for `react-native-reanimated`. After installing dependencies, rebuild the native app. If you are using a bare iOS project, run:

```bash
cd ios && pod install
```

If you are using Expo, install versions compatible with your SDK and rebuild the app if needed.

## **🚀 Quick Start**

```tsx
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from "react-native";
import {
  SyncedTabsLayout,
  TabFlatList,
  type TabItem,
  type TabPageProps,
  type TabViewTopTabsProps,
} from "react-native-synced-tab-view";

type DemoItem = {
  id: string;
  title: string;
};

const POSTS_DATA: DemoItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: `post-${index + 1}`,
  title: `Post ${index + 1}`,
}));

const SAVED_DATA: DemoItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: `saved-${index + 1}`,
  title: `Saved ${index + 1}`,
}));

const keyExtractor = (item: DemoItem) => item.id;

const DemoCard = React.memo(({ item }: { item: DemoItem }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>
  </View>
));

type FeedTabProps = Pick<TabPageProps, "index" | "width"> & {
  data: DemoItem[];
};

const FeedTab = React.memo(function FeedTab({
  index,
  width,
  data,
}: FeedTabProps) {
  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<DemoItem>) => <DemoCard item={item} />,
    [],
  );

  return (
    <TabFlatList
      index={index}
      width={width}
      data={data}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
});

export default function ExampleScreen() {
  const tabs = React.useMemo(
    () =>
      [
        {
          key: "posts",
          name: "Posts",
          component: ({ index, width }: TabPageProps) => (
            <FeedTab index={index} width={width} data={POSTS_DATA} />
          ),
        },
        {
          key: "saved",
          name: "Saved",
          component: ({ index, width }: TabPageProps) => (
            <FeedTab index={index} width={width} data={SAVED_DATA} />
          ),
        },
      ] satisfies TabItem[],
    [],
  );

  return (
    <View style={styles.container}>
      <SyncedTabsLayout
        header={
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>
              Collapsible header content goes here.
            </Text>
          </View>
        }
        tabs={tabs}
        initialTabIndex={0}
        topTabsProps={TOP_TABS_PROPS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 24,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
  },
  listContent: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

const TOP_TABS_PROPS = {
  indicatorColor: "#111827",
  indicatorHeight: 3,
  tabTextStyle: styles.tabText,
} satisfies TabViewTopTabsProps;
```

## **⚙️ API Reference**

### **Exports**

| Export | Description |
| :---- | :---- |
| `SyncedTabsLayout` | High-level layout component that wires the provider, measured header, top tabs, and pager together. |
| `TabFlatList` | Synchronized `FlatList` wrapper for tab content. |
| `TabSectionList` | Synchronized `SectionList` wrapper for tab content. |
| `TabScrollView` | Synchronized `ScrollView` wrapper for tab content. |
| `createSyncedTabScrollComponent` | Factory for wrapping third-party scrollable components. |

### **SyncedTabsLayout Props**

| Prop | Type | Description | Default |
| :---- | :---- | :---- | :---- |
| `header` | `React.ReactNode` | Content rendered above the tabs and measured by the shared scroller. | **Required** |
| `tabs` | `TabItem[]` | Tab definitions shared between the tab bar and pager. | **Required** |
| `width` | `number` | Width of the tab bar and page area. | Screen width |
| `initialTabIndex` | `number` | Tab shown on first render. | `0` |
| `topTabsProps` | `TabViewTopTabsProps` | Props forwarded to the built-in top tabs component. | `{}` |
| `scrollerProps` | `TabViewScrollerProps` | Props forwarded to the horizontal pager scroller. | `{}` |
| `tabsProviderProps` | `object` | Shared scroll behavior options, including `resetPreviousScrollingY`. | `{ resetPreviousScrollingY: true }` |
| `scrollerContainerProps` | `object` | Props for the outer synchronized vertical scroller. | — |
| `headerContainerProps` | `object` | Props for the measured header container. | — |

### **TabItem Shape**

| Field | Type | Description |
| :---- | :---- | :---- |
| `key` | `string \| number` | Stable identity used for React keys and tab state when provided. |
| `id` | `string \| number` | Alternate stable identity if `key` is not used. |
| `name` | `string` | Label rendered in the top tabs. |
| `component` | `(props: TabPageProps) => React.ReactNode` | Function that renders the tab page. |

`TabPageProps` includes:

* `item`: the current `TabItem`
* `index`: the tab index
* `width`: the page width
* `isActive`: a Reanimated shared value indicating whether the tab is active

### **Synced Scroll Components**

| Component | Based On | Extra Props |
| :---- | :---- | :---- |
| `TabFlatList<T>` | `FlatListProps<T>` | `index: number`, `width?: number` |
| `TabSectionList<ItemT, SectionT>` | `SectionListProps<ItemT, SectionT>` | `index: number`, `width?: number` |
| `TabScrollView` | `ScrollViewProps` | `index: number`, `width?: number` |

`TabFlatList` and `TabSectionList` intentionally do not expose `windowSize`.

### **Common `topTabsProps` Options**

| Prop | Type | Description | Default |
| :---- | :---- | :---- | :---- |
| `tabItemStyle` | `StyleProp<ViewStyle>` | Style applied to each tab item wrapper. | — |
| `tabTextStyle` | `StyleProp<TextStyle>` | Style applied to tab labels. | — |
| `indicatorColor` | `string` | Color of the active indicator. | `"white"` |
| `indicatorHeight` | `number` | Height of the indicator. | `4` |
| `indicatorWidth` | `number` | Width of the indicator. | `50` |
| `showIndicator` | `boolean` | Whether the indicator is visible. | `true` |
| `renderTabItem` | `(props: TopTabItemRenderProps) => React.ReactElement` | Custom tab item renderer. | — |
| `renderIndicator` | `() => React.ReactElement` | Custom indicator renderer. | — |

## **🧪 Custom Scroll Components**

If you want to sync a third-party list, wrap it with `createSyncedTabScrollComponent`:

```tsx
import { FlashList } from "@shopify/flash-list";
import { createSyncedTabScrollComponent } from "react-native-synced-tab-view";

const SyncedFlashList = createSyncedTabScrollComponent(FlashList);
```

The wrapped component still forwards refs to the underlying list instance, so imperative methods remain available.

## **🛠 Why not wire this manually?**

Profile-style tab layouts usually require several moving parts at the same time: a measured header, a horizontal pager, synchronized vertical offsets, and custom tab visuals. Wiring all of that by hand often leads to duplicated `onScroll` logic, ref coordination, and edge cases when switching tabs.

`react-native-synced-tab-view` packages those behaviors behind a small API so each tab can focus on rendering content instead of managing scroll synchronization.

## **📱 Example App**

The repository includes an Expo example app with these demo flows:

* Base synchronized tabs example
* Example with saved tab position
* Instagram-style profile layout
* TikTok-style profile layout
* FlashList integration example
* Legend List integration example

You can keep this section as-is or replace it with screenshots, GIFs, or hosted demo links later.

## **⚠️ Known Issues**

* Tab scroll-position reset and restore behavior should currently be considered experimental. On Android, it can flicker and may not be stable across every list adapter.
* When using a `LegendList` adapter inside a tab together with position reset on tab switch (`resetPreviousScrollingY: true`), resetting the list can temporarily show a white background.

## **📌 Limitations**

* This package currently supports Android and iOS. Web support is not available yet.
* The top section does not currently support a horizontal `FlatList`.
* If you need horizontal list content there, use a horizontal `FlashList` or horizontal `LegendList` instead.

## **💡 Recommendations**

* For the best performance with a vertical list and `tabsProviderProps={{ resetPreviousScrollingY: false }}`, prefer `LegendList`.
* If `resetPreviousScrollingY` is enabled (`true`, the default), prefer `FlashList`.

## **🧪 Local Development**

```bash
yarn install
yarn start
yarn example:ios
yarn example:android
yarn typecheck
yarn build
```

## **🧯 Troubleshooting**

* **Animations are not working**: Verify `react-native-reanimated` is installed and configured correctly in your app, then rebuild the native project.
* **Scroll sync feels inconsistent after tab changes**: Provide a stable `key` or `id` on every `TabItem`, especially if tab order can change.
* **You need a different list implementation**: Wrap it with `createSyncedTabScrollComponent` instead of syncing it manually.
* **You want the outer vertical scroll indicator visible**: Pass `scrollerContainerProps={{ showsVerticalScrollIndicator: true }}`.

## **📄 License**

MIT © Mohammed B.

## **☕ Support**

If you find this project useful and would like to support its ongoing development, consider buying me a coffee! Your support helps keep the creativity brewing and allows me to continue improving and maintaining this project. Thank you! ☕💖

<a href="https://buymeacoffee.com/bouarourmohammed" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
