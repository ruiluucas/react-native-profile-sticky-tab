import {
  FlashList as FL,
  FlashListProps,
  FlashListRef,
} from "@shopify/flash-list";
import React, { forwardRef, useCallback } from "react";
import { Dimensions } from "react-native";
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Criação segura do componente animado para evitar erros de tipagem do TypeScript
const AnimatedFlashList = Animated.createAnimatedComponent(
  FL,
) as unknown as React.ComponentClass<any>;

export interface ProfileStickyTabFlashListProps<T> extends FlashListProps<T> {
  stickyTab: { key: string; index: number };
}

function FlashListInner<T>(
  { stickyTab, ...props }: ProfileStickyTabFlashListProps<T>,
  forwardedRef: React.ForwardedRef<FlashListRef<T>>,
) {
  const {
    scrollY,
    sharedCurrentIndex,
    headerHeight,
    infoHeight,
    tabBarHeight,
    syncTrigger,
  } = useCoreContext();

  const animatedRef = useAnimatedRef<FlashListRef<T>>();
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

  // Espaçador invisível que empurra o conteúdo da lista para baixo do cabeçalho
  const listHeaderComponentStyle = useAnimatedStyle(() => ({
    height: headerHeight.value + infoHeight.value + tabBarHeight.value,
  }));

  const setRefs = useCallback(
    (node: any) => {
      (animatedRef as any)(node);

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<any>).current = node;
      }
    },
    [animatedRef, forwardedRef],
  );

  const handleContentSizeChange = (w: number, h: number) => {
    if (typeof props.onContentSizeChange === "function") {
      props.onContentSizeChange?.(w, h);
    }

    animatedRef.current?.scrollToOffset({
      offset: Math.min(scrollY.get(), infoHeight.get()),
      animated: false,
    });
  };

  const contentContainerStyle = useAnimatedStyle(() => {
    // A altura livre que a lista precisa ter para conseguir scrolar até o topo
    // é o tamanho da tela menos o que fica fixo no topo (headerHeight + tabBarHeight)
    const minHeight = SCREEN_HEIGHT - (headerHeight.value + tabBarHeight.value);

    return {
      minHeight: minHeight,
    };
  });

  return (
    <AnimatedFlashList
      {...props}
      ref={setRefs}
      contentContainerStyle={[
        props.contentContainerStyle,
        contentContainerStyle,
      ]}
      // No FlashList, usamos o espaçador como cabeçalho base. Se o usuário passar um
      // ListHeaderComponent próprio, você pode optar por encapsulá-lo dentro dessa View.
      ListHeaderComponent={<Animated.View style={listHeaderComponentStyle} />}
      onScroll={onScroll}
      onContentSizeChange={handleContentSizeChange}
      scrollEventThrottle={props.scrollEventThrottle ?? 16}
    />
  );
}

const FlashList = forwardRef(FlashListInner) as <T>(
  props: ProfileStickyTabFlashListProps<T> & {
    ref?: React.ForwardedRef<FlashListRef<T>>;
  },
) => ReturnType<typeof FlashListInner>;

export { FlashList };
