import hoistNonReactStatics from "hoist-non-react-statics";
import _ from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import Video from "react-native-video";
import styled from "styled-components/native";

import { audioStoreRef } from "src/stores/AudioStore";
import { getStore } from "src/stores/RootStore";
import { checkPlayCountForRating } from "src/utils/Rating";

const MainAudio = styled(Video)`
  display: none;
`;

const InstantAudio = styled(Video)`
  display: none;
`;

export const withAudio = <T extends object>(
  Component: React.ComponentType<T>
): any => {
  class WithAudio extends React.Component<T> {
    public isListenProgress = false;
    public isHalfPlayed = false;

    public render() {
      const {
        audioStore,
        contentStore,
        userStore,
        netStatusStore,
        magazineStore
      } = getStore();

      const { isWifiConnection } = netStatusStore;
      const { streaming } = userStore.clientSettings;
      const streamable = isWifiConnection || streaming;

      if (!streamable) {
        return <React.Fragment />;
      }

      return (
        <React.Fragment>
          <Component {...this.props} />
          <Observer>
            {() => {
              const currentAudio = audioStore.currentAudio;

              if (!currentAudio || audioStore.reachEnd) {
                return null;
              }

              return (
                <React.Fragment>
                  <MainAudio
                    ref={audioStoreRef}
                    source={{ uri: currentAudio.url }}
                    paused={audioStore.instantPlaying || !audioStore.playing}
                    onLoad={() => {
                      this.isListenProgress = false;
                      this.isHalfPlayed = false;

                      if (currentAudio.type === "CONTENT") {
                        contentStore.increasePlayCount(currentAudio.id);
                      } else {
                        magazineStore.increasePlayCount({
                          magazineId: currentAudio.magazineId!,
                          magazineContentId: currentAudio.id
                        });
                      }

                      checkPlayCountForRating();
                    }}
                    onProgress={e => {
                      const { currentTime, playableDuration } = audioStore;
                      if (this.isListenProgress) {
                        return;
                      }
                      audioStore.onAudioProgress(e);

                      this.isListenProgress = true;
                      setTimeout(() => (this.isListenProgress = false), 14);

                      if (
                        !this.isHalfPlayed &&
                        currentTime > playableDuration / 2
                      ) {
                        this.isHalfPlayed = true;

                        if (currentAudio.type === "CONTENT") {
                          contentStore.increaseHalfPlayCount(currentAudio.id);
                        }
                      }
                    }}
                    onEnd={() => {
                      this.isListenProgress = false;
                      this.isHalfPlayed = false;
                      this.onEndAudio();
                    }}
                    playInBackground={true}
                    progressUpdateInterval={16}
                    ignoreSilentSwitch="ignore"
                    audioOnly={true}
                  />
                </React.Fragment>
              );
            }}
          </Observer>
          <Observer>
            {() => {
              const instantAudio = audioStore.instantAudio;

              if (!instantAudio) {
                return null;
              }

              return (
                <InstantAudio
                  source={{ uri: instantAudio }}
                  paused={!audioStore.instantPlaying}
                  onEnd={audioStore.onInstantAudioEnd}
                  playInBackground={true}
                  ignoreSilentSwitch="ignore"
                  audioOnly={true}
                />
              );
            }}
          </Observer>
        </React.Fragment>
      );
    }

    private onEndAudio = () => {
      const { audioStore } = getStore();
      audioStore.onAudioEnd();
    };
  }

  return hoistNonReactStatics(WithAudio, Component);
};
