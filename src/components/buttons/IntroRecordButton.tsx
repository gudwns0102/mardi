import React from "react";
import styled from "styled-components/native";

import { Button, IButtonProps } from "src/components/buttons/Button";
import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";

interface IProps extends Omit<IButtonProps, "children"> {}

const Record = styled(Button)`
  height: 50px;
  padding-left: 17px;
  padding-right: 21px;
  background-color: ${colors.white};
  border-radius: 24.5px;
  border-color: ${colors.gray250};
  border-width: 1.5px;
`;

const RedCircle = styled.View`
  width: 19px;
  height: 19px;
  border-radius: 9.5px;
  background-color: ${colors.red100};
  margin-right: 14px;
`;

const RecordText = styled(Text).attrs({ type: "bold" })`
  font-size: 20px;
  color: ${colors.black};
`;

export function IntroRecordButton(props: IProps) {
  return (
    <Record {...props} activeOpacity={1}>
      <RedCircle />
      <RecordText>소개 한마디 녹음하기</RecordText>
    </Record>
  );
}
