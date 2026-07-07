import React, { forwardRef, useCallback } from "react";
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
import { Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface ProfileStickyTabFlatListProps<T> extends React.ComponentProps<
  typeof Animated.FlatList<T>
> {
  stickyTab: { key: string; index: number };
}

function FlatListInner<T>(
  { stickyTab, ...props }: ProfileStickyTabFlatListProps<T>,
  forwardedRef: React.ForwardedRef<Animated.FlatList<T>>,
) {
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

  // --- Merge de refs: animatedRef (necessário pro worklet/scrollTo) + ref
  // externo encaminhado pelo forwardRef, sem que um sobrescreva o outro.
  const setRefs = useCallback(
    (node: Animated.FlatList<T> | null) => {
      // useAnimatedRef retorna, por baixo dos panos, uma função de ref;
      // chamamos ela diretamente pra registrar o node (viewTag) também.
      (animatedRef as unknown as (node: Animated.FlatList<T> | null) => void)(
        node,
      );

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<Animated.FlatList<T> | null>
        ).current = node;
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
    <Animated.FlatList
      // 1) Spread primeiro: tudo que o usuário passar entra aqui.
      {...props}
      // 2) Overrides depois, só nas props que têm lógica interna crítica
      // (assim garantimos que a nossa lógica nunca é silenciosamente
      // sobrescrita, e a do usuário nunca é descartada).
      ref={setRefs}
      contentContainerStyle={[
        props.contentContainerStyle,
        contentContainerStyle,
      ]}
      ListHeaderComponent={<Animated.View style={listHeaderComponentStyle} />}
      onScroll={onScroll}
      onContentSizeChange={handleContentSizeChange}
      scrollEventThrottle={props.scrollEventThrottle ?? 16}
    />
  );
}

const FlatList = forwardRef(FlatListInner) as <T>(
  props: ProfileStickyTabFlatListProps<T> & {
    ref?: React.ForwardedRef<Animated.FlatList<T>>;
  },
) => ReturnType<typeof FlatListInner>;

export { FlatList };
