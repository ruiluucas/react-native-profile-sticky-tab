import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useCoreContext } from "./Context";
import { stickyScrollHandlers } from "./handlers/scrollHandlers";

export interface ProfileStickyTabFlatListProps<T> extends React.ComponentProps<
  typeof Animated.FlatList<T>
> {
  stickyTab: { key: string; index: number };
}

function FlatList<T>({
  stickyTab,
  ...props
}: ProfileStickyTabFlatListProps<T>) {
  const {
    scrollY,
    sharedCurrentIndex,
    headerHeight,
    infoHeight,
    tabBarHeight,
    syncTrigger,
  } = useCoreContext();

  const animatedRef = useAnimatedRef<Animated.FlatList<T>>();
  const listY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler(
    stickyScrollHandlers(listY, stickyTab),
  );

  useAnimatedReaction(
    () => ({
      scrollY: scrollY.value,
      syncTrigger: syncTrigger.value,
      sharedCurrentIndex: sharedCurrentIndex.value,
    }),
    (state, previous) => {
      if (!previous) return;

      const isActive = stickyTab.index === state.sharedCurrentIndex;
      const justBecameActive =
        isActive && stickyTab.index !== previous.sharedCurrentIndex;
      const shouldSyncInactive = !isActive && state.syncTrigger;

      if (justBecameActive || shouldSyncInactive) {
        const globalHeaderY = Math.min(state.scrollY, infoHeight.value);
        if (
          listY.value >= infoHeight.value &&
          globalHeaderY >= infoHeight.value
        )
          return;
        scrollTo(animatedRef, 0, globalHeaderY, false);
      }
    },
  );

  const listHeaderComponentStyle = useAnimatedStyle(() => ({
    height: headerHeight.value + infoHeight.value + tabBarHeight.value,
  }));

  return (
    <Animated.FlatList
      ref={animatedRef}
      ListHeaderComponent={<Animated.View style={listHeaderComponentStyle} />}
      onScroll={onScroll}
      onContentSizeChange={() => {
        animatedRef.current?.scrollToOffset({
          offset: Math.min(scrollY.get(), infoHeight.get()),
          animated: false,
        });
      }}
      scrollEventThrottle={16}
      {...props}
    />
  );
}

export { FlatList };
