import { SharedValue } from "react-native-reanimated";

export interface ContextType {
  syncTrigger: SharedValue<boolean>;
  scrollY: SharedValue<number>;
  currentIndex: number;
  sharedCurrentIndex: SharedValue<number>;
  setCurrentIndex: (index: number) => void;
  headerHeight: SharedValue<number>;
  infoHeight: SharedValue<number>;
  tabBarHeight: SharedValue<number>;
  sumHeight: SharedValue<number>;
}
