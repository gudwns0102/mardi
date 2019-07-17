import React from "react";
import { ImageProps, TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";

interface IProps {
  style?: TouchableOpacityProps["style"];
  onPress?: () => void;
  photo?: string | null;
  defaultSource?: ImageProps["source"];
  diameter?: number;
}

const TouchableWrapper = styled.TouchableOpacity``;

const Container = styled.Image<{ diameter: number }>`
  width: ${props => props.diameter};
  height: ${props => props.diameter};
  border-radius: ${props => props.diameter / 2};
`;

export function Avatar({
  style,
  onPress,
  photo,
  defaultSource = images.user,
  diameter = 40
}: IProps) {
  const avatarSource = photo ? { uri: photo } : defaultSource;
  return (
    <TouchableWrapper onPress={onPress} style={style}>
      <Container source={avatarSource} diameter={diameter} />
    </TouchableWrapper>
  );
}
