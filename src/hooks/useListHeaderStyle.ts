import {
  SharedValue,
  useAnimatedStyle
} from "react-native-reanimated";
import { useCoreContext } from "../Context";

export function useBoundaryStyles(coreFooterHeight: SharedValue<number>) {
  const { sumHeight } = useCoreContext();

  const headerStyle = useAnimatedStyle(() => ({
    height: sumHeight.value,
  }));

  const footerStyle = useAnimatedStyle(() => {
    return {
      height: Math.max(sumHeight.value, coreFooterHeight.value),
    };
  });

  return { headerStyle, footerStyle };
}
