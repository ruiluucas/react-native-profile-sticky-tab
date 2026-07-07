import React, { forwardRef, ReactNode, useCallback } from "react";
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

export interface ProfileStickyTabScrollViewProps extends React.ComponentProps<
  typeof Animated.ScrollView
> {
  stickyTab: { key: string; index: number };
  children: ReactNode;
}

function ScrollViewInner(
  { stickyTab, children, ...props }: ProfileStickyTabScrollViewProps,
  forwardedRef: React.ForwardedRef<Animated.ScrollView>,
) {
  const {
    scrollY,
    sharedCurrentIndex,
    headerHeight,
    infoHeight,
    tabBarHeight,
    syncTrigger,
  } = useCoreContext();

  const animatedRef = useAnimatedRef<Animated.ScrollView>();
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

  // Espaçador no topo para garantir que o conteúdo fique abaixo do cabeçalho
  const listHeaderComponentStyle = useAnimatedStyle(() => ({
    height: headerHeight.value + infoHeight.value + tabBarHeight.value,
  }));

  // Merge das referências seguro (mesma lógica da v1)
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
    // Mantém o callback do usuário caso ele passe um por fora
    if (typeof props.onContentSizeChange === "function") {
      props.onContentSizeChange?.(w, h);
    }

    // No ScrollView, o método do lado JS é scrollTo({ y, animated })
    animatedRef.current?.scrollTo({
      y: Math.min(scrollY.get(), infoHeight.get()),
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
    <Animated.ScrollView
      {...props}
      ref={setRefs}
      onScroll={onScroll}
      contentContainerStyle={[
        props.contentContainerStyle,
        contentContainerStyle,
      ]}
      onContentSizeChange={handleContentSizeChange}
      scrollEventThrottle={props.scrollEventThrottle ?? 16}
    >
      {/* O substituto do ListHeaderComponent */}
      <Animated.View style={listHeaderComponentStyle} />

      {/* O conteúdo real que o usuário passar dentro do ScrollView */}
      {children}
    </Animated.ScrollView>
  );
}

const ScrollView = forwardRef(ScrollViewInner) as (
  props: ProfileStickyTabScrollViewProps & {
    ref?: React.ForwardedRef<Animated.ScrollView>;
  },
) => ReturnType<typeof ScrollViewInner>;

export { ScrollView };
