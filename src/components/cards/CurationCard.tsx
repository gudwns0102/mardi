import React from "react";
import { TouchableOpacity, ViewProps } from "react-native";
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
  width: 220px;
  height: 64px;
`;

const Container = styled.View`
  width: 200px;
  height: 64px;
  align-items: center;
  text-align: center;
`;

const CardContainer = styled.ImageBackground<{
  activeBackgroundColor: string;
}>`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 64px;
  border-radius: 14px;
  padding: 10px 18px;
  margin-bottom: 10px;
  background-color: ${props => props.activeBackgroundColor};
`;

const Content = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: ${colors.white};
`;

const createShadowOpt = (color: string) => ({
  width: 196,
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
        <TouchableOpacity onPress={onPress}>
          <BoxShadow setting={createShadowOpt(getBackgroundById(curation.id))}>
            <CardContainer
              source={images.pattern1}
              activeBackgroundColor={getBackgroundById(curation.id)}
            >
              <Content numberOfLines={3}>{curation.question.text}</Content>
            </CardContainer>
          </BoxShadow>
        </TouchableOpacity>
      </Container>
    </Padding>
  );
}
