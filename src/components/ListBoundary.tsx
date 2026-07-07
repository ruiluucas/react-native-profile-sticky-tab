import React from "react";
import Animated from "react-native-reanimated";

export interface ListBoundaryProps {
  clientComponent?: any;
  type: "header" | "footer";
  coreStyle: any;
}

export const ListBoundary: React.FC<ListBoundaryProps> = ({
  clientComponent,
  type,
  coreStyle,
}) => {
  const renderClientContent = () => {
    if (!clientComponent) return null;
    if (React.isValidElement(clientComponent)) return clientComponent;

    if (
      clientComponent &&
      typeof clientComponent === "object" &&
      "value" in clientComponent
    ) {
      const ResolvedValue = clientComponent.value;
      if (!ResolvedValue) return null;
      if (React.isValidElement(ResolvedValue)) return ResolvedValue;
      const SharedComponent = ResolvedValue as React.ComponentType<any>;
      return <SharedComponent />;
    }

    const Component = clientComponent as React.ComponentType<any>;
    return <Component />;
  };

  const coreSpacer = <Animated.View style={coreStyle} />;
  const clientContent = renderClientContent();

  return (
    <>
      {type === "header" ? (
        <>
          {coreSpacer}
          {clientContent}
        </>
      ) : (
        <>
          {clientContent}
          {coreSpacer}
        </>
      )}
    </>
  );
};
