import { memo, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { TabView } from "react-native-tab-view";
import { Provider, useCoreContext } from "./Context";
import { FlashList } from "./FlashList";
import { FlatList } from "./FlatList";
import ProfileStickyTabProps from "./ProfileStickyTab.types";
import { ScrollView } from "./ScrollView";
import { useStickyTab } from "./useStickyTab";

const styles = StyleSheet.create({
  header: {
    zIndex: 2,
  },
  tabView: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

const ProfileStickyTabComponent = ({
  header,
  children,
  renderTabBar,
  tabKeyScenes,
}: ProfileStickyTabProps) => {
  const {
    scrollY,
    currentIndex,
    setCurrentIndex,
    sharedCurrentIndex,
    headerHeight,
    infoHeight,
  } = useCoreContext();

  const translateY = useDerivedValue(() => {
    return -interpolate(
      scrollY.value,
      [0, infoHeight.value],
      [0, infoHeight.value],
      Extrapolation.CLAMP,
    );
  }, [scrollY, infoHeight]);

  const infoContainerStyle = useAnimatedStyle(() => ({
    zIndex: 1,
    transform: [{ translateY: translateY.value }],
  }));

  const tabBarContainerStyle = useAnimatedStyle(() => ({
    top: headerHeight.value + infoHeight.value,
    zIndex: 1,
    transform: [{ translateY: translateY.value }],
  }));

  const routes = useMemo(
    () =>
      tabKeyScenes.map(
        (s) =>
          ({
            key: s.key,
            title: s.title,
            tabIcon: s.icon,
          }) as any,
      ),
    [tabKeyScenes],
  );

  const handleHeaderLayout = useCallback(
    (e: any) => headerHeight.set(e.nativeEvent.layout.height),
    [headerHeight],
  );

  const handleInfoLayout = useCallback(
    (e: any) => infoHeight.set(e.nativeEvent.layout.height),
    [infoHeight],
  );

  const renderScene = useCallback(
    ({ route }: any) => {
      const tb = routes.findIndex((i) => i.key === route.key);
      return tabKeyScenes[tb].renderComponent({
        key: route.key,
        index: tb,
      });
    },
    [routes, tabKeyScenes],
  );

  const handleIndexChange = useCallback(
    (index: number) => {
      sharedCurrentIndex.set(index);
      setCurrentIndex(index);
    },
    [sharedCurrentIndex, setCurrentIndex],
  );

  const renderTabBarWrapper = useCallback(
    (p: any) => (
      <Animated.View style={tabBarContainerStyle}>
        {renderTabBar(p)}
      </Animated.View>
    ),
    [renderTabBar, tabBarContainerStyle],
  );

  return (
    <>
      <Animated.View onLayout={handleHeaderLayout} style={styles.header}>
        {header}
      </Animated.View>
      <Animated.View onLayout={handleInfoLayout} style={infoContainerStyle}>
        {children}
      </Animated.View>
      <TabView
        style={styles.tabView}
        navigationState={useMemo(
          () => ({ index: currentIndex, routes }),
          [currentIndex, routes],
        )}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        renderTabBar={renderTabBarWrapper}
        lazyPreloadDistance={1}
        lazy
      />
    </>
  );
};

const MemoizedFlashList = memo(FlashList) as typeof FlashList;
const MemoizedFlatList = memo(FlatList) as typeof FlatList;
const MemoizedScrollView = memo(ScrollView) as typeof ScrollView;

const ProfileStickyTab = Object.assign(memo(ProfileStickyTabComponent), {
  FlatList: MemoizedFlatList,
  FlashList: MemoizedFlashList,
  ScrollView: MemoizedScrollView,
  Provider: memo(Provider),
  useStickyTab,
});

export { ProfileStickyTab };
