import hoistNonReactStatics from "hoist-non-react-statics";
import { Observer } from "mobx-react";
import React, { ComponentType } from "react";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import styled from "styled-components/native";

import { ClosableToast } from "src/components/ClosableToast";
import { Text } from "src/components/Text";
import { getStore } from "src/stores/RootStore";
import { ToastType } from "src/stores/ToastStore";

const Toast = styled.TouchableOpacity.attrs({
  activeOpacity: 1
})<{ toastType: ToastType }>`
  position: absolute;
  width: 100%;
  height: 42px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.toastType === "ERROR"
      ? "rgba(255, 10, 10, 0.7)"
      : "rgba(25, 86, 212, 0.7)"};
  padding: 0 15px;
  z-index: 10;
`;

const ToastContent = styled(Text).attrs({
  type: "bold"
})`
  color: white;
  text-align: center;
`;

export function withToast<T>(Component: ComponentType<T>): any {
  class WithToast extends React.Component<T> {
    public render() {
      const { toastStore } = getStore();
      return (
        <>
          <Component {...this.props} />
          <Observer>
            {() =>
              toastStore.show ? (
                toastStore.type === "CLOSABLE" ? (
                  <ClosableToast
                    style={{
                      marginTop:
                        toastStore.marginTop
                        // + (isIphoneX() ? getStatusBarHeight() : 0)
                    }}
                    onClose={toastStore.onClose}
                    onFollowPress={toastStore.onFollowPress}
                  />
                ) : (
                  <Toast
                    toastType={toastStore.type}
                    onPress={toastStore.closeToast}
                    style={{
                      marginTop:
                        toastStore.marginTop +
                        (isIphoneX() ? getStatusBarHeight() : 0)
                    }}
                  >
                    <ToastContent>{toastStore.content}</ToastContent>
                  </Toast>
                )
              ) : null
            }
          </Observer>
        </>
      );
    }
  }

  return hoistNonReactStatics(WithToast, Component);
}
