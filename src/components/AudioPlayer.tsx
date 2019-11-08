import { BlurView } from "@react-native-community/blur";
import React, { useState } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { Text } from "src/components/Text";
import { IAudio } from "src/stores/AudioStore";
import { colors } from "src/styles/colors";
import { isAndroid } from "src/utils/Platform";

interface IProps {
  style?: ViewProps["style"];
  audio: IAudio | null;
  isPlaying?: boolean;
  onPress?: () => any;
  onHeartPress?: () => any;
  onRewindPress?: () => any;
  onAudioPress?: () => any;
  currentTime: number;
  playableDuration: number;
}

const Wrapper = styled.TouchableOpacity.attrs({ activeOpacity: 0.6 })`
  width: 100%;
  height: 54px;
`;

const Container = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${isAndroid()
    ? "rgba(248, 248, 248, 0.9)"
    : "rgba(248, 248, 248, 0.7)"};
  padding: 8px 10px 8px 8px;
`;

const BlurLayer = styled(BlurView)`
  position: absolute;
  top: 2px;
  bottom: 0;
  left: 0;
  right: 0;
`;

const ProgressBar = styled.View`
  width: 100%;
  height: 2px;
  background-color: rgb(216, 216, 216);
`;

const PlayBar = styled.View<{ percent: number }>`
  width: ${props => props.percent}%;
  height: 100%;
  background-color: ${colors.blue300};
`;

const Column = styled.View`
  flex: 1;
  margin-right: 11px;
`;

const Title = styled(Text).attrs({
  type: "bold",
  numberOfLines: 1
})`
  font-size: 14px;
  color: ${colors.mardiBlack};
  ${isAndroid() ? "transform: translate(0px, 2px)" : ""};
`;

const Author = styled(Text).attrs({ numberOfLines: 1 })`
  font-size: 13px;
  color: ${colors.mardiBlack};
  ${isAndroid() ? "transform: translate(0px, -5px)" : ""};
`;

const Heart = styled(IconButton)`
  width: 36px;
  height: 36px;
  margin-right: 9px;
`;

const Rewind = styled(IconButton).attrs({ source: images.btnMiniPlayerRew5 })`
  width: 36px;
  height: 36px;
  margin-right: 9px;
`;

const Play = styled(IconButton).attrs({ source: images.playBlue })`
  width: 34px;
  height: 36px;
`;

const Pause = styled(IconButton).attrs({ source: images.pauseBlue })`
  width: 34px;
  height: 36px;
`;

export function AudioPlayer({
  audio,
  isPlaying,
  style,
  onPress,
  onHeartPress,
  onRewindPress,
  onAudioPress,
  currentTime,
  playableDuration
}: IProps) {
  const percent = (currentTime / playableDuration) * 100;
  return (
    <Wrapper style={style} onPress={onPress}>
      <ProgressBar>
        <PlayBar percent={percent} />
      </ProgressBar>
      <BlurLayer blurAmount={17} blurType="light" />
      <Container>
        <Heart
          source={
            audio && audio.heart_by_me ? images.heart36 : images.heart36Off
          }
          onPress={onHeartPress}
        />
        <Column>
          <Title>{audio ? audio.title : ""}</Title>
          <Author>{audio ? audio.username : ""}</Author>
        </Column>
        <Rewind onPress={onRewindPress} />
        {isPlaying ? (
          <Pause onPress={onAudioPress} />
        ) : (
          <Play onPress={onAudioPress} />
        )}
      </Container>
    </Wrapper>
  );
}
