import ProfileStickyTab from "@/core";
import { StyleSheet, Text, View } from "react-native";
import { TabBar } from "react-native-tab-view";

const data = Array.from({ length: 200 }, (_, index) => index);

export default function Index() {
  return (
    <ProfileStickyTab.Provider>
      <ProfileStickyTab
        header={
          <View
            style={{
              height: 100,
              backgroundColor: "orange",
            }}
          />
        }
        renderTabBar={(props) => <TabBar {...props} />}
        tabKeyScenes={[
          {
            key: "first",
            title: "FlatList",
            renderComponent: (p) => (
              <ProfileStickyTab.FlatList
                stickyTab={p}
                data={data}
                renderItem={({ index }) => (
                  <Text style={[styles.item, styles.flatListItem]}>
                    {index}
                  </Text>
                )}
              />
            ),
          },
          {
            key: "second",
            title: "FlashList",
            renderComponent: (p) => (
              <ProfileStickyTab.FlatList
                stickyTab={p}
                data={data}
                renderItem={({ index }) => (
                  <Text style={[styles.item, styles.flatListItem]}>
                    {index}
                  </Text>
                )}
              />
            ),
          },
          {
            key: "third",
            title: "ScrollView",
            renderComponent: (p) => (
              <ProfileStickyTab.FlatList
                stickyTab={p}
                data={data}
                renderItem={({ index }) => (
                  <Text style={[styles.item, styles.flatListItem]}>
                    {index}
                  </Text>
                )}
              />
            ),
          },
        ]}
      >
        <View
          style={{
            height: 300,
            backgroundColor: "blue",
          }}
        />
      </ProfileStickyTab>
    </ProfileStickyTab.Provider>
  );
}

const styles = StyleSheet.create({
  item: {
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  flatListItem: {
    backgroundColor: "red",
  },
  flashListItem: {
    backgroundColor: "gray",
  },
  scrollViewItem: {
    backgroundColor: "purple",
  },
});
