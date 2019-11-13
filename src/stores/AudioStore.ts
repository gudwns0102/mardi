import _ from "lodash";
import { types } from "mobx-state-tree";
import React from "react";
import Video from "react-native-video";

import { IMagazineContent } from "src/models/MagazineContent";
import { getRootStore } from "src/stores/RootStoreHelper";

export interface IAudio {
  id: number;
  type: AudioType;
  url: string;
  heart_by_me?: boolean;
  username: string;
  photo?: string | null;
  title: string;
  questionText?: string;
  num_hearts?: number;
  num_replies?: number;
  image?: string | null;
  default_image_color_idx?: number;
  default_image_pattern_idx?: number;
  uuid: string | null;
  audio_duration: number;
  magazineId?: number;
}

export const audioStoreRef = React.createRef<Video>();

export const AudioStore = types
  .model({
    audios: types.optional(types.array(types.frozen<IAudio>()), []),
    playing: types.optional(types.boolean, false),
    currentTime: types.optional(types.number, 0),
    playableDuration: types.optional(types.number, 0),
    reachEnd: types.optional(types.boolean, false),
    audioHistory: types.optional(types.array(types.frozen<IAudio>()), []),

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

    const createAudioFromContent = (content: IContent): IAudio => {
      return {
        id: content.id,
        type: "CONTENT",
        url: content.audio,
        heart_by_me: content.heart_by_me,
        title: content.title,
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
        currentAudio &&
        currentAudio.type === "CONTENT" &&
        incomingAudioId === currentAudio.id;
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
        self.audioHistory.clear();
        return;
      } else if (!currentAudioIsReachEnd) {
        self.playing = !self.playing;
        self.reachEnd = false;
        return;
      } else {
        clearAudioMetadata();
      }
    };

    const pushMagazineContentAudio = ({
      id,
      title,
      text,
      audio,
      num_replies,
      num_played,
      audio_duration,
      picture,
      magazineId,
      user_name,
      link_user
    }: IMagazineContent & { magazineId: number }) => {
      const incomingAudioId = id;
      const currentAudio = getCurrentAudio();
      const alreadyHasAudio = self.audios.length !== 0;
      const incomingAudioIsCurrentAudio =
        currentAudio &&
        currentAudio.type === "MAGAZINE" &&
        incomingAudioId === currentAudio.id;
      const currentAudioIsReachEnd = alreadyHasAudio && self.reachEnd;

      const playable = checkPlayability();

      if (!playable) {
        showPlayabilityToast();
        return;
      }
      clearInstantAudio();

      if (!alreadyHasAudio || !incomingAudioIsCurrentAudio) {
        clearAudioMetadata();
        self.audios.replace([
          {
            id,
            type: "MAGAZINE" as const,
            url: audio!,
            audio_duration: audio_duration || Infinity,
            default_image_color_idx: 0,
            default_image_pattern_idx: 0,
            heart_by_me: false,
            image: picture,
            title,
            num_hearts: 0,
            num_replies,
            username: user_name || "",
            uuid: link_user ? link_user.uuid || null : null,
            magazineId,
            photo: picture
          }
        ]);
        self.audioHistory.clear();
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
        audio => audio.type === "CONTENT" && audio.id === contentId
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
      self.audioHistory.push(self.audios.shift()!);

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

    const prev = () => {
      if (self.audioHistory.length === 0) {
        throw new Error(
          "Prev cannot be invoked because there is no audio history"
        );
      }

      clearAudioMetadata();
      self.audios.unshift(self.audioHistory.pop()!);
    };

    const next = () => {
      if (self.audios.length <= 1) {
        throw new Error(
          "Next cannot be invoked because there is no remain audios"
        );
      }

      clearAudioMetadata();
      self.audioHistory.push(self.audios.shift()!);
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
        audio => audio.type === "CONTENT" && audio.id === contentId
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
      self.audioHistory.clear();
      clearAudioMetadata();
    };

    const clearAudios = () => {
      self.audios.clear();
    };

    return {
      clearInstantAudio,
      pushAudio,
      pushMagazineContentAudio,
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
      clearAudios,
      prev,
      next
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
      },

      get hasPrev() {
        return self.audioHistory.length > 0;
      },

      get hasNext() {
        return self.audios.length > 1;
      }
    };
  });

export type IAudioStore = typeof AudioStore.Type;
