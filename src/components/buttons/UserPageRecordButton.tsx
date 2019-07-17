import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { Button } from "src/components/buttons/Button";
import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";

const Container = styled(Button)`
  flex-direction: row;
  align-items: center;
  height: 22px;
  padding-left: 7px;
  padding-right: 10px;
  border-radius: 11px;
  background-color: rgb(200, 200, 200);
`;

const RedCircle = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: rgb(255, 10, 10);
  margin-right: 11px;
`;

const Content = styled(Text).attrs({ type: "bold" })`
  font-size: 13px;
  color: ${colors.white};
`;

export function UserPageRecordButton(props: TouchableOpacityProps) {
  return (
    <Container {...props}>
      <RedCircle />
      <Content>소개 한마디 녹음하기</Content>
    </Container>
  );
}
