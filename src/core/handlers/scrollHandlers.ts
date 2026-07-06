import { ScrollHandlers, SharedValue } from "react-native-reanimated";
import { useCoreContext } from "../Context";

export function stickyScrollHandlers(
  listY: SharedValue<number>,
  stickyTab: {
    key: string;
    index: number;
  },
) {
  const { scrollY, sharedCurrentIndex, syncTrigger } = useCoreContext();

  return {
    onScroll: (e) => {
      "worklet";
      const currentY = Math.max(e.contentOffset.y, 0);
      listY.set(currentY);
      if (stickyTab.index === sharedCurrentIndex.value) scrollY.set(currentY);
    },
    onBeginDrag: () => {
      "worklet";
      if (stickyTab.index === sharedCurrentIndex.value) syncTrigger.set(false);
    },
    onEndDrag: () => {
      "worklet";
      if (stickyTab.index === sharedCurrentIndex.value) syncTrigger.set(true);
    },
  } as ScrollHandlers<Record<string, unknown>>;
}
