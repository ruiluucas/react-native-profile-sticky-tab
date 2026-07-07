import ProfileStickyTab from "../src";
import { Text, View } from "react-native";
import { TabBar } from "react-native-tab-view";

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
            key: "flatlist",
            title: "FlatList",
            renderComponent: (p) => (
              <ProfileStickyTab.FlatList
                stickyTab={p}
                data={Array.from({ length: 200 })}
                renderItem={({ index }) => (
                  <Text
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: 10,
                    }}
                  >
                    FlatList - Item {index}
                  </Text>
                )}
              />
            ),
          },
          {
            key: "flashlist",
            title: "FlashList",
            renderComponent: (p) => (
              <ProfileStickyTab.FlashList
                stickyTab={p}
                data={Array.from({ length: 200 })}
                renderItem={({ index }) => (
                  <Text
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      padding: 10,
                    }}
                  >
                    FlashList - Item {index}
                  </Text>
                )}
              />
            ),
          },
          {
            key: "scrollview",
            title: "ScrollView",
            renderComponent: (p) => (
              <ProfileStickyTab.ScrollView stickyTab={p}>
                {Array.from({ length: 200 }).map((_, index) => (
                  <Text
                    key={index}
                    style={{
                      backgroundColor: "purple",
                      color: "white",
                      padding: 10,
                    }}
                  >
                    ScrollView - Item {index}
                  </Text>
                ))}
              </ProfileStickyTab.ScrollView>
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
