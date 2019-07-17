import hoistNonReactStatics from "hoist-non-react-statics";
import { Observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";

import { RatingPopup } from "src/components/popups/RatingPopup";
import { getStore } from "src/stores/RootStore";
import { deviceHeight, deviceWidth } from "src/utils/Dimensions";
import { showRatingPopup } from "src/utils/Rating";

const Overlay = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  position: absolute;
  width: ${deviceWidth};
  height: ${deviceHeight};
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
`;

export const withModal = <T extends object>(
  Component: React.ComponentType<T>
): any => {
  return hoistNonReactStatics(
    class extends React.Component<T> {
      public render() {
        const { modalStore } = getStore();
        return (
          <React.Fragment>
            <Component {...this.props} />
            <Observer>
              {() =>
                modalStore.show && (
                  <Overlay onPress={modalStore.hideModal}>
                    {modalStore.type === "RATING" ? (
                      <RatingPopup
                        onCancel={modalStore.hideModal}
                        onConfirm={() => {
                          showRatingPopup();
                          modalStore.hideModal();
                        }}
                      />
                    ) : null}
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
