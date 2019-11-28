import _ from "lodash";
import { inject, Observer, observer } from "mobx-react";
import React from "react";
import { Animated } from "react-native";
import { NavigationScreenProp, withNavigation } from "react-navigation";

import { AudioPlayer } from "src/components/AudioPlayer";
import { navigatePlayerScreen } from "src/screens/PlayerScreen";
import { IAudio } from "src/stores/AudioStore";
import { getStore, IRootStore } from "src/stores/RootStore";
import { isAndroid } from "src/utils/Platform";

interface IProps {
  navigation: NavigationScreenProp<any>;
  audio: IAudio | null;
}

interface IState {
  show: boolean;
}

@inject("store")
@observer
class Component extends React.Component<IProps, IState> {
  public isAnimating = false;
  public opacity = new Animated.Value(0);

  public state = {
    show: false
  };

  public componentDidUpdate(prevProps: IProps) {
    const { audio: currentAudio } = this.props;
    const { audio: prevAudio } = prevProps;
    const audioChanged = currentAudio !== prevAudio;

    if (audioChanged && currentAudio === null) {
      this.hidePlayer();
    } else if (audioChanged && currentAudio) {
      this.showPlayer();
    }
  }

  public render() {
    const { audio } = this.props;
    const { audioStore, contentStore, magazineStore } = getStore();

    return (
      <Observer>
        {() => {
          const { reachEnd } = audioStore;
          const { show } = this.state;
          const { currentTime, playableDuration } = audioStore;

          if (!audio) {
            return (
              <Animated.View
                style={{
                  opacity: this.opacity,
                  display: this.isAnimating ? "flex" : show ? "flex" : "none",
                  height: this.opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 54]
                  })
                }}
              >
                <AudioPlayer
                  audio={null}
                  currentTime={0}
                  playableDuration={100}
                />
              </Animated.View>
            );
          }

          if (isAndroid()) {
            return (
              <Animated.View style={{ display: !reachEnd ? "flex" : "none" }}>
                <AudioPlayer
                  audio={audio}
                  isPlaying={audioStore.playing}
                  onPress={this.onPlayerPress}
                  onHeartPress={
                    audio.type === "CONTENT"
                      ? _.partial(contentStore.clickHeart, audio.id)
                      : _.partial(magazineStore.clickHeart, {
                          magazineId: audio.magazineId!,
                          magazineContentId: audio.id
                        })
                  }
                  onRewindPress={audioStore.rewind}
                  onAudioPress={audioStore.toggleAudio}
                  currentTime={currentTime}
                  playableDuration={playableDuration}
                />
              </Animated.View>
            );
          }

          return (
            <Animated.View
              style={{
                opacity: this.opacity,
                display: this.isAnimating ? "flex" : show ? "flex" : "none",
                height: this.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 54]
                })
              }}
            >
              <AudioPlayer
                audio={audio}
                isPlaying={audioStore.playing}
                onPress={this.onPlayerPress}
                onHeartPress={
                  audio.type === "CONTENT"
                    ? _.partial(contentStore.clickHeart, audio.id)
                    : _.partial(magazineStore.clickHeart, {
                        magazineId: audio.magazineId!,
                        magazineContentId: audio.id
                      })
                }
                onRewindPress={audioStore.rewind}
                onAudioPress={audioStore.toggleAudio}
                currentTime={currentTime}
                playableDuration={playableDuration}
              />
            </Animated.View>
          );
        }}
      </Observer>
    );
  }

  private onPlayerPress = () => {
    const { navigation, audio } = this.props;
    const { show } = this.state;

    if (!audio) {
      return;
    }

    if (!show) {
      return;
    }

    navigatePlayerScreen(navigation, {});
  };

  private showPlayer = () => {
    if (!this.isAnimating) {
      this.setState({ show: true });
      this.isAnimating = true;
      Animated.timing(this.opacity, {
        toValue: 1,
        // useNativeDriver: true,
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
        // useNativeDriver: true,
        duration: 300
      }).start(() => {
        this.isAnimating = false;
        this.setState({ show: false });
      });
    }
  };
}

export const ObservableAudioPlayer = withNavigation(Component);
