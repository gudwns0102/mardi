import React from "react";
import { ViewProps } from "react-native";
import { BoxShadow } from "react-native-shadow";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Text } from "src/components/Text";
import { colors, getBackgroundById } from "src/styles/colors";

interface IProps {
  curation: ICuration;
  style?: ViewProps["style"];
  onPress?: () => any;
}

const Padding = styled.View`
  width: 176px;
  height: 64px;
  padding-left: 10px;
`;

const Container = styled.View`
  width: 156px;
  height: 64px;
  align-items: center;
  text-align: center;
  border-radius: 14px;
`;

const TouchableOpacity = styled.TouchableOpacity<{
  activeBackgroundColor: string;
}>`
  align-items: center;
  justify-content: center;
  width: 156px;
  height: 64px;
  padding: 0 6px;
  border-radius: 14px;
  background-color: ${props => props.activeBackgroundColor};
  overflow: hidden;
`;

const Content = styled(Text).attrs({ type: "bold" })`
  width: 120px;
  font-size: 16px;
  color: ${colors.white};
  text-align: center;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const createShadowOpt = (color: string) => ({
  width: 156,
  height: 64,
  color,
  border: 8,
  radius: 14,
  opacity: 0.6,
  x: 0,
  y: 3
});

export function CurationCard({ curation, onPress, style }: IProps) {
  return (
    <Padding>
      <Container style={style}>
        <BoxShadow setting={createShadowOpt(getBackgroundById(curation.id))}>
          <TouchableOpacity
            onPress={onPress}
            activeBackgroundColor={getBackgroundById(curation.id)}
          >
            <BackgroundImage source={images.pattern1} />
            <Content numberOfLines={2}>{curation.question.text}</Content>
          </TouchableOpacity>
        </BoxShadow>
      </Container>
    </Padding>
  );
}
