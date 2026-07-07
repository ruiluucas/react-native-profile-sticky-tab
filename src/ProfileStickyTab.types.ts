import { ReactNode } from "react";
import {
  NavigationState,
  Route,
  SceneRendererProps,
} from "react-native-tab-view";
import { StickyTabType } from "./types";

export default interface ProfileStickyTabProps {
  /**
   * Componente fixo que fica estático no início da tela.
   */
  header?: ReactNode;
  children?: ReactNode;
  renderTabBar: (
    props: SceneRendererProps & {
      navigationState: NavigationState<
        Route & {
          key: string;
          title: string;
          tabIcon?: (color: string) => ReactNode;
        }
      >;
    },
  ) => React.ReactNode;
  tabKeyScenes: {
    title: string;
    key: string;
    renderComponent: (stickyTab: StickyTabType) => ReactNode;
    icon?: (color: string) => ReactNode;
  }[];
}
