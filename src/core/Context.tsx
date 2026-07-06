import { createContext, ReactNode, useContext, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { ContextType } from "./Context.types";

export const Context = createContext<ContextType | undefined>(undefined);

export const useCoreContext = () => {
  const c = useContext(Context);
  if (!c)
    throw new Error("The context must be inside ProfileStickyTab.Provider");
  return c;
};

export const Provider = ({ children }: { children: ReactNode }) => {
  const syncTrigger = useSharedValue(false);

  const scrollY = useSharedValue(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const sharedCurrentIndex = useSharedValue(0);

  const headerHeight = useSharedValue(0);
  const infoHeight = useSharedValue(0);
  const tabBarHeight = useSharedValue(0);

  return (
    <Context.Provider
      value={{
        syncTrigger,
        scrollY,
        currentIndex,
        setCurrentIndex,
        sharedCurrentIndex,
        headerHeight,
        infoHeight,
        tabBarHeight,
      }}
    >
      {children}
    </Context.Provider>
  );
};
