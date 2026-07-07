import React, { forwardRef } from "react";
import { Dimensions } from "react-native";
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListBoundary } from "./components/ListBoundary";
import { useCoreContext } from "./Context";
import { useMergeRefs } from "./handlers/assignRefs";
import { stickyScrollHandlers } from "./handlers/scrollHandlers";
import { useBoundaryStyles } from "./hooks/useListHeaderStyle";
import { StickyTabType } from "./types";

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

export interface ProfileStickyTabFlatListProps<T> extends React.ComponentProps<
  typeof Animated.FlatList<T>
> {
  stickyTab: StickyTabType;
}

function FlatListInner<T>(
  { stickyTab, ...props }: ProfileStickyTabFlatListProps<T>,
  forwardedRef: React.ForwardedRef<Animated.FlatList<T>>,
) {
  const { scrollY, sharedCurrentIndex, infoHeight, syncTrigger, sumHeight } =
    useCoreContext();

  const coreFooterHeight = useSharedValue(0);
  const { headerStyle, footerStyle } = useBoundaryStyles(coreFooterHeight);

  const ref = useAnimatedRef<Animated.FlatList<T>>();
  const setRefs = useMergeRefs(ref, forwardedRef);

  const listY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler(
    stickyScrollHandlers(listY, stickyTab),
  );
  const insets = useSafeAreaInsets();

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
        scrollTo(ref, 0, globalHeaderY, false);
      }
    },
  );

  const handleContentSizeChange = (w: number, h: number) => {
    if (typeof props.onContentSizeChange === "function")
      props.onContentSizeChange(w, h);

    const contentAbove = h - Math.max(sumHeight.get(), coreFooterHeight.get());
    const targetMinHeight = SCREEN_HEIGHT - insets.top + infoHeight.get();
    const requiredFooterHeight = targetMinHeight - contentAbove;

    if (Math.abs(coreFooterHeight.get() - requiredFooterHeight) > 1)
      coreFooterHeight.set(requiredFooterHeight);

    ref.current?.scrollToOffset({
      offset: Math.min(scrollY.get(), infoHeight.get()),
      animated: false,
    });
  };

  return (
    <Animated.FlatList
      {...props}
      ref={setRefs}
      ListHeaderComponent={
        <ListBoundary
          clientComponent={props.ListHeaderComponent}
          coreStyle={headerStyle}
          type="header"
        />
      }
      ListFooterComponent={
        <ListBoundary
          clientComponent={props.ListFooterComponent}
          coreStyle={footerStyle}
          type="footer"
        />
      }
      onScroll={onScroll}
      onContentSizeChange={handleContentSizeChange}
      scrollEventThrottle={props.scrollEventThrottle ?? 16}
    />
  );
}

export const FlatList = forwardRef(FlatListInner) as <T>(
  props: ProfileStickyTabFlatListProps<T> & {
    ref?: React.ForwardedRef<Animated.FlatList<T>>;
  },
) => ReturnType<typeof FlatListInner>;
