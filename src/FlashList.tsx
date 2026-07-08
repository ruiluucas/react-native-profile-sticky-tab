import {
  FlashList as FL,
  FlashListProps,
  FlashListRef,
} from "@shopify/flash-list";
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

// Componente animado criado a partir da FlashList do Shopify
const AnimatedFlashList = Animated.createAnimatedComponent(
  FL,
) as unknown as React.ComponentClass<any>;

export interface ProfileStickyTabFlashListProps<T> extends FlashListProps<T> {
  stickyTab: StickyTabType;
}

function FlashListInner<T>(
  { stickyTab, ...props }: ProfileStickyTabFlashListProps<T>,
  forwardedRef: React.ForwardedRef<FlashListRef<T>>,
) {
  const {
    scrollY,
    sharedCurrentIndex,
    infoHeight,
    syncTrigger,
    sumHeight,
    programmaticScroll,
  } = useCoreContext();

  const coreFooterHeight = useSharedValue(0);
  const { headerStyle, footerStyle } = useBoundaryStyles(coreFooterHeight);

  const animatedRef = useAnimatedRef<FlashListRef<T>>();
  const setRefs = useMergeRefs(animatedRef, forwardedRef);

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
      programmaticScroll: programmaticScroll.value,
    }),
    (state, previous) => {
      if (!previous) return;

      const isActive = stickyTab.index === state.sharedCurrentIndex;

      if (
        isActive &&
        state.programmaticScroll.version !==
          previous.programmaticScroll.version
      ) {
        scrollTo(
          animatedRef,
          0,
          state.programmaticScroll.y,
          state.programmaticScroll.animated,
        );
        return;
      }

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

  const handleContentSizeChange = (w: number, h: number) => {
    if (typeof props.onContentSizeChange === "function") {
      props.onContentSizeChange(w, h);
    }

    // Mesma lógica matemática para garantir a rolagem mínima necessária na FlashList
    const contentAbove = h - Math.max(sumHeight.get(), coreFooterHeight.get());
    const targetMinHeight = SCREEN_HEIGHT - insets.top + infoHeight.get();
    const requiredFooterHeight = targetMinHeight - contentAbove;

    if (Math.abs(coreFooterHeight.get() - requiredFooterHeight) > 1) {
      coreFooterHeight.set(requiredFooterHeight);
    }

    animatedRef.current?.scrollToOffset({
      offset: Math.min(scrollY.get(), infoHeight.get()),
      animated: false,
    });
  };

  return (
    <AnimatedFlashList
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

export const FlashList = forwardRef(FlashListInner) as <T>(
  props: ProfileStickyTabFlashListProps<T> & {
    ref?: React.ForwardedRef<FlashListRef<T>>;
  },
) => ReturnType<typeof FlashListInner>;
