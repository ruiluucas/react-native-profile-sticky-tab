# react-native-profile-sticky-tab

A tab component with a fixed header and collapsible profile area for React Native.

This library combines `react-native-tab-view`, `react-native-reanimated`, and animated lists to deliver a common profile-screen experience: a fixed header at the top, a profile information area that collapses on scroll, and tabs with synchronized scroll position between `FlatList`, `FlashList`, and `ScrollView`.

|         Example         |         Instagram Example         |
| :---------------------: | :-------------------------------: |
| ![](./docs/example.gif) | ![](./docs/instagram-example.gif) |

## Features

* Fixed header at the top of the screen.
* Collapsible profile area below the header.
* Tab bar integrated with `react-native-tab-view`.
* Scroll synchronization between tabs.
* Support for `FlatList`, `FlashList`, and `ScrollView`.
* Programmatic control through `useStickyTab`.
* UI-thread animated scrolling with Reanimated.
* Composable API for custom tab bars.

## Installation

```bash
npm install react-native-profile-sticky-tab
```

Also install the peer dependencies:

```bash
npm install react-native-reanimated react-native-tab-view @shopify/flash-list
```

If your project does not use Reanimated yet, make sure to complete the setup required by `react-native-reanimated` in your app, including the Babel plugin when necessary.

## Basic Usage

```tsx
import ProfileStickyTab from "react-native-profile-sticky-tab";
import { Text, View } from "react-native";
import { TabBar } from "react-native-tab-view";

const DATA = Array.from({ length: 40 }, (_, index) => ({
  id: String(index),
  title: `Post ${index + 1}`,
}));

export function ProfileScreen() {
  return (
    <ProfileStickyTab.Provider>
      <ProfileStickyTab
        header={<View style={{ height: 72, backgroundColor: "#111827" }} />}
        renderTabBar={(props) => <TabBar {...props} />}
        tabKeyScenes={[
          {
            key: "posts",
            title: "Posts",
            renderComponent: (stickyTab) => (
              <ProfileStickyTab.FlatList
                stickyTab={stickyTab}
                data={DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Text style={{ padding: 16 }}>{item.title}</Text>
                )}
              />
            ),
          },
          {
            key: "about",
            title: "About",
            renderComponent: (stickyTab) => (
              <ProfileStickyTab.ScrollView stickyTab={stickyTab}>
                <Text style={{ padding: 16 }}>
                  About tab content
                </Text>
              </ProfileStickyTab.ScrollView>
            ),
          },
        ]}
      >
        <View style={{ height: 220, backgroundColor: "#2563eb" }}>
          <Text style={{ color: "white", padding: 16, fontSize: 24 }}>
            Rui Lucas
          </Text>
          <Text style={{ color: "white", paddingHorizontal: 16 }}>
            React Native Developer
          </Text>
        </View>
      </ProfileStickyTab>
    </ProfileStickyTab.Provider>
  );
}
```

## How the Structure Works

```tsx
<ProfileStickyTab.Provider>
  <ProfileStickyTab
    header={<Header />}
    renderTabBar={(props) => <TabBar {...props} />}
    tabKeyScenes={scenes}
  >
    <ProfileInfo />
  </ProfileStickyTab>
</ProfileStickyTab.Provider>
```

`ProfileStickyTab.Provider` stores the shared scroll state, active tab state, and layout heights.

`header` stays fixed at the top of the screen.

`children` represents the collapsible area, usually used for the profile photo, bio, stats, or profile actions.

`tabKeyScenes` defines the tabs and the component rendered for each one.

Each scene must render one of the library containers and pass the `stickyTab` object received in `renderComponent`.

## Tab Containers

### FlatList

Use it when the tab renders a standard React Native list.

```tsx
<ProfileStickyTab.FlatList
  stickyTab={stickyTab}
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item item={item} />}
/>
```

### FlashList

Use it when the tab renders large lists and you want to use `@shopify/flash-list`.

```tsx
<ProfileStickyTab.FlashList
  stickyTab={stickyTab}
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item item={item} />}
  estimatedItemSize={80}
/>
```

### ScrollView

Use it when the tab has free-form, smaller, or more static content.

```tsx
<ProfileStickyTab.ScrollView stickyTab={stickyTab}>
  <ProfileDetails />
</ProfileStickyTab.ScrollView>
```

## Programmatic Control

Use `useStickyTab` in any component rendered inside `ProfileStickyTab.Provider`.

```tsx
import { useStickyTab } from "react-native-profile-sticky-tab";
import { Pressable, Text, View } from "react-native";

export function CustomActions() {
  const {
    currentTab,
    setTab,
    scrollToY,
    collapseHeader,
    expandHeader,
  } = useStickyTab();

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Pressable onPress={() => setTab(0)}>
        <Text style={{ fontWeight: currentTab === 0 ? "700" : "400" }}>
          Posts
        </Text>
      </Pressable>

      <Pressable onPress={() => setTab(1)}>
        <Text style={{ fontWeight: currentTab === 1 ? "700" : "400" }}>
          About
        </Text>
      </Pressable>

      <Pressable onPress={() => collapseHeader(true)}>
        <Text>Collapse header</Text>
      </Pressable>

      <Pressable onPress={() => expandHeader(true)}>
        <Text>Expand header</Text>
      </Pressable>

      <Pressable onPress={() => scrollToY(300, true)}>
        <Text>Scroll to Y 300</Text>
      </Pressable>
    </View>
  );
}
```

You can also access the hook through the component namespace:

```tsx
const stickyTab = ProfileStickyTab.useStickyTab();
```

## Hook API

| Return           | Type                                      | Description                                           |
| ---------------- | ----------------------------------------- | ----------------------------------------------------- |
| `currentTab`     | `number`                                  | Index of the active tab in React state.               |
| `setTab`         | `(index: number) => void`                 | Changes the active tab programmatically.              |
| `scrollToY`      | `(y: number, animated?: boolean) => void` | Scrolls the active tab to a vertical position.        |
| `collapseHeader` | `(animated?: boolean) => void`            | Scrolls to the limit that collapses the profile area. |
| `expandHeader`   | `(animated?: boolean) => void`            | Scrolls back to the top and expands the profile area. |

## Props

### `ProfileStickyTab`

| Prop           | Type                   | Description                                                |
| -------------- | ---------------------- | ---------------------------------------------------------- |
| `header`       | `ReactNode`            | Fixed content at the top of the screen.                    |
| `children`     | `ReactNode`            | Collapsible content below the header.                      |
| `renderTabBar` | `(props) => ReactNode` | Function that renders the `react-native-tab-view` tab bar. |
| `tabKeyScenes` | `TabScene[]`           | List of tabs and their respective components.              |

### `TabScene`

```ts
type TabScene = {
  key: string;
  title: string;
  renderComponent: (stickyTab: StickyTabType) => ReactNode;
  icon?: (color: string) => ReactNode;
};

type StickyTabType = {
  key: string;
  index: number;
};
```

### Containers

All containers receive the required `stickyTab` prop.

| Component                     | Additional props                            |
| ----------------------------- | ------------------------------------------- |
| `ProfileStickyTab.FlatList`   | `Animated.FlatList` props.                  |
| `ProfileStickyTab.FlashList`  | `@shopify/flash-list` props.                |
| `ProfileStickyTab.ScrollView` | `Animated.ScrollView` props and `children`. |

## Exports

```tsx
import ProfileStickyTab, {
  ProfileStickyTab as NamedProfileStickyTab,
  useStickyTab,
} from "react-native-profile-sticky-tab";

import type {
  ProfileStickyTabProps,
  ProfileStickyTabFlatListProps,
  ProfileStickyTabFlashListProps,
  ProfileStickyTabScrollViewProps,
} from "react-native-profile-sticky-tab";
```

## Best Practices

* Wrap the screen with `ProfileStickyTab.Provider`.
* Use `ProfileStickyTab.FlatList`, `ProfileStickyTab.FlashList`, or `ProfileStickyTab.ScrollView` inside each `renderComponent`.
* Always pass the `stickyTab` object received by the scene to the tab container.
* Use `FlashList` for large lists and provide `estimatedItemSize`.
* Use `useStickyTab` only inside the provider.
* Avoid manually controlling the list scroll from outside if your goal is to keep it synchronized with the collapsible header.

## License

MIT
