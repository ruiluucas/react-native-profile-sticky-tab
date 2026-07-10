import { ScrollHandlers, SharedValue } from "react-native-reanimated";
import { useCoreContext } from "../Context";

export function stickyScrollHandlers(
  listY: SharedValue<number>,
  stickyTab: {
    key: string;
    index: number;
  },
) {
  const { scrollY, sharedCurrentIndex, syncTrigger, infoHeight } =
    useCoreContext();

  return {
    onScroll: (e) => {
      "worklet";
      const currentY = Math.max(e.contentOffset.y, 0);
      listY.set(currentY);
      if (stickyTab.index === sharedCurrentIndex.value)
        scrollY.set(Math.min(currentY, infoHeight.value));
    },
    onBeginDrag: () => {
      "worklet";
      if (stickyTab.index === sharedCurrentIndex.value) syncTrigger.set(false);
    },
    onMomentumEnd: () => {
      "worklet";
      if (stickyTab.index === sharedCurrentIndex.value) syncTrigger.set(true);
    },
  } as ScrollHandlers<Record<string, unknown>>;
}
