import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import React from "react";
import Video from "react-native-video";

import { getRootStore } from "src/stores/RootStoreHelper";

export interface IAudio {
  id: IContent["id"];
  url: IContent["audio"];
  heart_by_me: IContent["heart_by_me"];
  name: IContent["user"]["name"];
  username: IContent["user"]["username"];
  photo: IContent["user"]["photo"];
  title: IContent["title"];
  questionText: string;
  num_hearts: IContent["num_hearts"];
  num_replies: IContent["num_replies"];
  image: IContent["image"];
  default_image_color_idx: IContent["default_image_color_idx"];
  default_image_pattern_idx: IContent["default_image_pattern_idx"];
  uuid: IContent["user"]["uuid"];
  audio_duration: IContent["audio_duration"];
}

export const audioStoreRef = React.createRef<Video>();

export const AudioStore = types
  .model({
    audios: types.optional(types.array(types.frozen<IAudio>()), []),
    playing: types.optional(types.boolean, false),
    currentTime: types.optional(types.number, 0),
    playableDuration: types.optional(types.number, 0),
    reachEnd: types.optional(types.boolean, false),

    instantAudio: types.maybeNull(types.string),
    instantPlaying: types.optional(types.boolean, false)
  })
  .actions(self => {
    const { netStatusStore, userStore, toastStore } = getRootStore(self);

    const getCurrentAudio = () => {
      const length = self.audios.length;

      if (length === 0) {
        return null;
      }

      return self.audios[0];
    };

    const checkPlayability = () => {
      const { isWifiConnection } = netStatusStore;
      const streaming = userStore.client
        ? userStore.clientSettings.streaming
        : true;
      const streamable = isWifiConnection || streaming;

      return streamable;
    };

    const showPlayabilityToast = () => {
      toastStore.openToast({
        type: "INFO",
        content:
          "Wi-fi 연결 또는 ‘My page > 설정’ 에서\n3G/LTE 스트리밍을 허용해주세요"
      });
    };

    const createAudioFromContent = (content: IContent) => {
      return {
        id: content.id,
        url: content.audio,
        heart_by_me: content.heart_by_me,
        title: content.title,
        name: content.user.name,
        username: content.user.username,
        questionText: _.get(content.question, ["text"], ""),
        photo: content.user.photo,
        image: content.image,
        num_hearts: content.num_hearts,
        num_replies: content.num_replies,
        default_image_color_idx: content.default_image_color_idx,
        default_image_pattern_idx: content.default_image_pattern_idx,
        uuid: content.user.uuid,
        audio_duration: content.audio_duration
      };
    };

    const clearAudioMetadata = () => {
      self.playing = true;
      self.currentTime = 0;
      self.playableDuration = 0;
      self.reachEnd = false;
    };

    const clearInstantAudio = () => {
      self.instantAudio = null;
      self.instantPlaying = false;
    };

    const pushAudio = (content: IContent) => {
      const incomingAudioId = content.id;
      const currentAudio = getCurrentAudio();
      const alreadyHasAudio = self.audios.length !== 0;
      const incomingAudioIsCurrentAudio =
        currentAudio && incomingAudioId === currentAudio.id;
      const currentAudioIsReachEnd = alreadyHasAudio && self.reachEnd;

      const playable = checkPlayability();

      if (!playable) {
        showPlayabilityToast();
        return;
      }

      clearInstantAudio();

      if (!alreadyHasAudio || !incomingAudioIsCurrentAudio) {
        clearAudioMetadata();
        self.audios.replace([createAudioFromContent(content)]);
        return;
      } else if (!currentAudioIsReachEnd) {
        self.playing = !self.playing;
        self.reachEnd = false;
        return;
      } else {
        clearAudioMetadata();
      }
    };

    const popAudio = (contentId: IAudio["id"]) => {
      const targetAudioIndex = self.audios.findIndex(
        audio => audio.id === contentId
      );

      if (targetAudioIndex !== -1) {
        self.audios.splice(targetAudioIndex, 1);

        if (targetAudioIndex === 0) {
          clearAudioMetadata();
        }
      }
    };

    const stopAudio = () => {
      self.playing = false;
    };

    const toggleAudio = () => {
      const isReachEnd = self.reachEnd;

      if (isReachEnd) {
        self.reachEnd = false;
        self.playing = true;
        return;
      }

      self.playing = !self.playing;
    };

    const onAudioProgress = ({
      currentTime,
      playableDuration
    }: {
      currentTime: number;
      playableDuration: number;
    }) => {
      self.currentTime = currentTime;
      self.playableDuration = playableDuration;
    };

    const onAudioEnd = () => {
      self.audios.shift();

      const currentAudio = getCurrentAudio();

      self.currentTime = 0;

      if (!currentAudio) {
        self.reachEnd = true;
        self.playing = false;
      } else {
        self.reachEnd = false;
        self.playing = true;
      }
    };

    const seek = (seconds: number) => {
      if (self.reachEnd) {
        return;
      }
      _.invoke(audioStoreRef.current, ["seek"], seconds);
      self.currentTime = Math.min(Math.max(0, seconds), self.playableDuration);
      return self.currentTime;
    };

    const rewind = () => {
      return seek(self.currentTime - 5);
    };

    const fastforward = () => {
      return seek(self.currentTime + 5);
    };

    const seekByPercent = (percent: number) => {
      const absoluteSeconds = (self.playableDuration * percent) / 100;
      return seek(absoluteSeconds);
    };

    const pushInstantAudio = (audio: string) => {
      const isCurrentInstantAudio = audio === self.instantAudio;

      if (isCurrentInstantAudio) {
        self.instantPlaying = !self.instantPlaying;
        return;
      }

      const playable = checkPlayability();

      if (!playable) {
        showPlayabilityToast();
        return;
      }

      self.instantAudio = audio;
      self.instantPlaying = true;
    };

    const onInstantAudioEnd = () => {
      clearInstantAudio();
    };

    const updateAudioIfExist = (
      contentId: IContent["id"],
      audioData: Partial<IAudio>
    ) => {
      const targetAudioIndex = self.audios.findIndex(
        audio => audio.id === contentId
      );

      if (targetAudioIndex !== -1) {
        self.audios.replace([
          ...self.audios.slice(0, targetAudioIndex),
          {
            ...self.audios[targetAudioIndex],
            ...audioData
          },
          ...self.audios.slice(targetAudioIndex + 1)
        ]);
      }
    };

    const pushAudios = (contents: IContent[]) => {
      self.audios.replace(
        contents.map(content => createAudioFromContent(content))
      );
      clearAudioMetadata();
    };

    const clearAudios = () => {
      self.audios.clear();
    };

    return {
      clearInstantAudio,
      pushAudio,
      popAudio,
      toggleAudio,
      onAudioProgress,
      onAudioEnd,
      stopAudio,
      rewind,
      fastforward,
      seekByPercent,
      pushInstantAudio,
      onInstantAudioEnd,
      updateAudioIfExist,
      pushAudios,
      clearAudios
    };
  })
  .views(self => {
    return {
      get currentAudio() {
        const length = self.audios.length;

        if (length === 0) {
          return null;
        }

        return self.audios[0];
      }
    };
  });

export type IAudioStore = typeof AudioStore.Type;
