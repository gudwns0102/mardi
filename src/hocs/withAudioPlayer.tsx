import hoistNonReactStatics from "hoist-non-react-statics";
import _ from "lodash";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { WrappedAudioPlayer } from "src/components/WrappedAudioPlayer";

export const withAudioPlayer = <
  T extends { navigation: NavigationScreenProp<any, any> }
>(
  Component: React.ComponentType<T>
): any => {
  class WithAudio extends React.Component<T> {
    public render() {
      return (
        <React.Fragment>
          <Component {...this.props} />
          <WrappedAudioPlayer />
        </React.Fragment>
      );
    }
  }

  return hoistNonReactStatics(WithAudio, Component);
};
