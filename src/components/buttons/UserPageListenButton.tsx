import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Button } from "src/components/buttons/Button";
import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";

interface IProps extends TouchableOpacityProps {
  playing: boolean;
}

const Container = styled(Button)`
  flex-direction: row;
  align-items: center;
  width: 130px;
  height: 22px;
  padding: 0 12px;
  border-radius: 11px;
  background-color: rgb(25, 86, 212);
`;

const PlayImage = styled.Image.attrs({ source: images.btnMypageProfilePlay })`
  width: 16px;
  height: 16px;
  margin-right: 3px;
`;

const PlayingImage = styled.Image.attrs({
  source: images.btnMypageProfilePlaying
})`
  width: 16px;
  height: 16px;
  margin-right: 3px;
`;

const Content = styled(Text).attrs({ type: "bold" })`
  font-size: 13px;
  color: ${colors.white};
`;

export function UserPageListenButton({ playing, ...props }: IProps) {
  return (
    <Container {...props}>
      {playing ? <PlayingImage /> : <PlayImage />}
      <Content>소개 한마디 듣기</Content>
    </Container>
  );
}
