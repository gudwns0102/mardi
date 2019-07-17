import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";

interface IProps {
  playing?: boolean;
  onPress?: () => any;
  children: string;
  style?: TouchableOpacityProps["style"];
}

const Container = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  max-width: ${deviceWidth - 51 - 64 - 14};
  flex-direction: row;
  align-items: center;
  height: 50px;
  border-radius: 24.5px;
  background-color: ${colors.blue300};
  z-index: 100;
`;

const ChatImage = styled.Image`
  width: 50px;
  height: 50px;
  position: absolute;
  left: 0;
`;

const AudioIcon = styled.Image`
  width: 32px;
  height: 32px;
  margin-left: 12px;
`;

const Content = styled(Text).attrs({ type: "bold" })`
  font-size: 20px;
  color: ${colors.white};
  align-self: center;
  text-align: center;
  margin-right: 21px;
  max-width: ${deviceWidth - 51 - 64 - 14 - 44 - 21};
  line-height: 29px;
`;

export function IntroAudioButton(props: IProps) {
  return (
    <Container onPress={props.onPress} style={props.style}>
      <ChatImage source={images.icChatBubbleBig} />
      <AudioIcon
        source={
          props.playing
            ? images.btnMypageProfilePlaying
            : images.btnMypageProfilePlay
        }
      />
      <Content numberOfLines={1}>{props.children}</Content>
    </Container>
  );
}
