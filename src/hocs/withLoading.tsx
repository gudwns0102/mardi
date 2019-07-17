import hoistNonReactStatics from "hoist-non-react-statics";
import { Observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";

import { getStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";
import { deviceHeight, deviceWidth } from "src/utils/Dimensions";
import { isAndroid } from "src/utils/Platform";

const Overlay = styled.View`
  position: absolute;
  width: ${deviceWidth};
  height: ${deviceHeight};
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.ActivityIndicator.attrs({
  size: isAndroid() ? 25 : 0,
  color: colors.blue300
})``;

export const withLoading = <T extends object>(
  Component: React.ComponentType<T>
): any => {
  return hoistNonReactStatics(
    class extends React.Component<T> {
      public render() {
        const { loadingStore } = getStore();
        return (
          <React.Fragment>
            <Component {...this.props} />
            <Observer>
              {() =>
                loadingStore.show && (
                  <Overlay>
                    <Spinner />
                  </Overlay>
                )
              }
            </Observer>
          </React.Fragment>
        );
      }
    },
    Component
  );
};
