import ProfileStickyTab from "@/core";
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
            key: "1",
            title: "First",
            renderComponent: (p) => (
              <ProfileStickyTab.FlatList
                stickyTab={p}
                data={Array.from({ length: 200 })}
                renderItem={({ index }) => (
                  <Text style={{ backgroundColor: "red", color: "white" }}>
                    {index}
                  </Text>
                )}
                initialNumToRender={50}
              />
            ),
          },
          {
            key: "2",
            title: "First",
            renderComponent: (p) => (
              <ProfileStickyTab.FlatList
                stickyTab={p}
                data={Array.from({ length: 200 })}
                renderItem={({ index }) => (
                  <Text style={{ backgroundColor: "red", color: "white" }}>
                    {index}
                  </Text>
                )}
                initialNumToRender={50}
              />
            ),
          },
          {
            key: "3",
            title: "First",
            renderComponent: (p) => (
              <ProfileStickyTab.FlatList
                stickyTab={p}
                data={Array.from({ length: 200 })}
                renderItem={({ index }) => (
                  <Text style={{ backgroundColor: "red", color: "white" }}>
                    {index}
                  </Text>
                )}
                initialNumToRender={50}
              />
            ),
          },
          {
            key: "4",
            title: "Second",
            renderComponent: (p) => (
              <ProfileStickyTab.FlatList
                stickyTab={p}
                data={Array.from({ length: 200 })}
                renderItem={({ index }) => (
                  <Text style={{ backgroundColor: "gray", color: "white" }}>
                    {index}
                  </Text>
                )}
                initialNumToRender={50}
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
