import React from "react";
import styled from "styled-components/native";

import { Button } from "src/components/buttons/Button";
import { Bold } from "src/components/texts/Bold";
import { colors } from "src/styles/colors";

interface IProps {
  sortType: ContentSortType;
  onLatestPress: () => void;
  onTrendPress: () => void;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 96px;
  height: 24px;
  padding: 0 10px;
  border-radius: 11.5px;
  background-color: ${colors.white};
`;

const Content = styled(Bold)<{ isActive: boolean }>`
  font-size: 14px;
  color: ${props =>
    props.isActive ? "rgb(25, 86, 212)" : "rgb(155, 155, 155)"};
`;

export function ContentSortTypeButtonGroup({
  sortType,
  onLatestPress,
  onTrendPress
}: IProps) {
  return (
    <Container>
      <Button onPress={onLatestPress}>
        <Content isActive={sortType === "LATEST"}>최신</Content>
      </Button>
      <Button onPress={onTrendPress}>
        <Content isActive={sortType === "TREND"}>인기</Content>
      </Button>
    </Container>
  );
}
