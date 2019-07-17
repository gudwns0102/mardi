import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Button } from "src/components/buttons/Button";
import { colors } from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  isPlaying?: boolean;
  onPress?: () => any;
}

const AudioIcon = styled.Image`
  width: 28px;
  height: 28px;
`;

const AudioButton = styled(Button).attrs({
  textProps: {
    type: "bold",
    style: {
      color: colors.blue300,
      fontSize: 14,
      lineHeight: 20
    }
  }
})`
  width: 82px;
  height: 34px;
  border-radius: 8px;
  background-color: rgb(246, 246, 246);
`;

export function ListenButton(props: IProps) {
  return (
    <AudioButton style={props.style} onPress={props.onPress}>
      <AudioIcon
        source={props.isPlaying ? images.icEqualizBlue : images.playBlue}
      />
      Listen
    </AudioButton>
  );
}
