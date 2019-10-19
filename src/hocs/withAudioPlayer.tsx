import hoistNonReactStatics from "hoist-non-react-statics";
import _ from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import { Animated, View } from "react-native";
import { NavigationScreenProp, withNavigation } from "react-navigation";

import { AudioPlayer } from "src/components/AudioPlayer";
import { navigatePlayerScreen } from "src/screens/PlayerScreen";
import { getStore } from "src/stores/RootStore";
import { isAndroid } from "src/utils/Platform";

interface IState {
  show: boolean;
}

export const withAudioPlayer = <
  T extends { navigation: NavigationScreenProp<any, any> }
>(
  Component: React.ComponentType<T>
): any => {
  class WithAudio extends React.Component<T, IState> {
    public isAnimating = false;
    public opacity = new Animated.Value(0);

    public state = {
      show: false
    };

    public render() {
      const { audioStore, contentStore } = getStore();

      return (
        <React.Fragment>
          <Component {...this.props} />
          <Observer>
            {() => {
              const { currentAudio, reachEnd } = audioStore;
              const { show } = this.state;
              const { currentTime, playableDuration } = audioStore;

              if (!currentAudio) {
                this.hidePlayer();
                return null;
              }

              if (reachEnd) {
                this.hidePlayer();
              } else {
                this.showPlayer();
              }

              if (isAndroid()) {
                return (
                  <View style={{ display: !reachEnd ? "flex" : "none" }}>
                    <AudioPlayer
                      audio={currentAudio}
                      isPlaying={audioStore.playing}
                      onPress={this.onPlayerPress}
                      onHeartPress={_.partial(
                        contentStore.clickHeart,
                        currentAudio.id
                      )}
                      onRewindPress={audioStore.rewind}
                      onAudioPress={audioStore.toggleAudio}
                      currentTime={currentTime}
                      playableDuration={playableDuration}
                    />
                  </View>
                );
              }

              return (
                <Animated.View
                  style={{
                    opacity: this.opacity,
                    display: this.isAnimating ? "flex" : show ? "flex" : "none"
                    // transform: [
                    //   {
                    //     translateY: this.opacity.interpolate({
                    //       inputRange: [0, 1],
                    //       outputRange: [54, 0]
                    //     })
                    //   }
                    // ]
                  }}
                >
                  <AudioPlayer
                    audio={currentAudio}
                    isPlaying={audioStore.playing}
                    onPress={this.onPlayerPress}
                    onHeartPress={_.partial(
                      contentStore.clickHeart,
                      currentAudio.id
                    )}
                    onRewindPress={audioStore.rewind}
                    onAudioPress={audioStore.toggleAudio}
                    currentTime={currentTime}
                    playableDuration={playableDuration}
                  />
                </Animated.View>
              );
            }}
          </Observer>
        </React.Fragment>
      );
    }

    private onPlayerPress = () => {
      const { navigation } = this.props;
      const { show } = this.state;
      const { audioStore } = getStore();
      const { currentAudio } = audioStore;

      if (!currentAudio) {
        return;
      }

      if (!show) {
        return;
      }

      navigatePlayerScreen(navigation, {
        id: currentAudio.id
      });
    };

    private showPlayer = () => {
      if (!this.isAnimating) {
        this.setState({ show: true });
        this.isAnimating = true;
        Animated.timing(this.opacity, {
          toValue: 1,
          useNativeDriver: true,
          duration: 300
        }).start(() => {
          this.isAnimating = false;
        });
      }
    };

    private hidePlayer = () => {
      if (!this.isAnimating) {
        this.isAnimating = true;
        Animated.timing(this.opacity, {
          toValue: 0,
          useNativeDriver: true,
          duration: 300
        }).start(() => {
          this.isAnimating = false;
          this.setState({ show: false });
        });
      }
    };
  }

  return withNavigation(hoistNonReactStatics(WithAudio, Component));
};
