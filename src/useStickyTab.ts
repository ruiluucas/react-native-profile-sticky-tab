import { useCallback } from "react";
import { useCoreContext } from "./Context";

export const useStickyTab = () => {
  const {
    currentIndex,
    setCurrentIndex,
    sharedCurrentIndex,
    infoHeight,
    programmaticScroll,
  } = useCoreContext();

  const setTab = useCallback(
    (index: number) => {
      sharedCurrentIndex.set(index);
      setCurrentIndex(index);
    },
    [sharedCurrentIndex, setCurrentIndex],
  );

  const scrollToY = useCallback(
    (y: number, animated = true) => {
      programmaticScroll.set({
        y,
        animated,
        version: programmaticScroll.get().version + 1,
      });
    },
    [programmaticScroll],
  );

  const collapseHeader = useCallback(
    (animated = true) => {
      scrollToY(infoHeight.get(), animated);
    },
    [scrollToY, infoHeight],
  );

  const expandHeader = useCallback(
    (animated = true) => {
      scrollToY(0, animated);
    },
    [scrollToY],
  );

  return {
    currentTab: currentIndex,
    setTab,
    scrollToY,
    collapseHeader,
    expandHeader,
  };
};
