# Changelog

All notable changes to this project will be documented in this file.

## 1.0.0

Initial public release of `react-native-synced-tab-view`.

### Added

- `SyncedTabsLayout` for building synchronized top tabs with a collapsible header
- `TabFlatList`, `TabSectionList`, and `TabScrollView` for synced tab content
- `createSyncedTabScrollComponent` for integrating custom scrollable components
- configurable top tabs with indicator and custom tab item rendering
- support for modern React Native projects using `react-native-reanimated` and `react-native-worklets`

### Supported

- React Native `>= 0.76`
- React `>= 18`
- Android
- iOS

### Limitations

- Web is not supported
- some scroll reset and restore behavior is still experimental in certain cases
