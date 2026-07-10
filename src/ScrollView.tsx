import React, { forwardRef, ReactNode } from "react";
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

export interface ProfileStickyTabScrollViewProps extends React.ComponentProps<
  typeof Animated.ScrollView
> {
  stickyTab: StickyTabType;
  children: ReactNode;
}

function ScrollViewInner(
  { stickyTab, children, ...props }: ProfileStickyTabScrollViewProps,
  forwardedRef: React.ForwardedRef<Animated.ScrollView>,
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

  const animatedRef = useAnimatedRef<Animated.ScrollView>();
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
  
      const shouldSyncInactive =
        !isActive && state.syncTrigger && !previous.syncTrigger;
  
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

    // Mesma assinatura matemática para preenchimento de segurança da tela
    const contentAbove = h - Math.max(sumHeight.get(), coreFooterHeight.get());
    const targetMinHeight = SCREEN_HEIGHT - insets.top + infoHeight.get();
    const requiredFooterHeight = targetMinHeight - contentAbove;

    if (Math.abs(coreFooterHeight.get() - requiredFooterHeight) > 1) {
      coreFooterHeight.set(requiredFooterHeight);
    }

    // ScrollView utiliza o método .scrollTo padrão ao invés de scrollToOffset
    animatedRef.current?.scrollTo({
      y: Math.min(scrollY.get(), infoHeight.get()),
      animated: false,
    });
  };

  return (
    <Animated.ScrollView
      {...props}
      ref={setRefs}
      onScroll={onScroll}
      onContentSizeChange={handleContentSizeChange}
      scrollEventThrottle={props.scrollEventThrottle ?? 16}
    >
      {/* Spacer do Cabeçalho Animado */}
      <ListBoundary coreStyle={headerStyle} type="header" />

      {children}

      {/* Spacer do Rodapé para garantir rolagem mínima */}
      <ListBoundary coreStyle={footerStyle} type="footer" />
    </Animated.ScrollView>
  );
}

export const ScrollView = forwardRef(ScrollViewInner) as (
  props: ProfileStickyTabScrollViewProps & {
    ref?: React.ForwardedRef<Animated.ScrollView>;
  },
) => ReturnType<typeof ScrollViewInner>;
