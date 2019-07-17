import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { ContentLayoutCardButton } from "src/components/buttons/ContentLayoutCardButton";
import { ContentLayoutListButton } from "src/components/buttons/ContentLayoutListButton";
import { Bold } from "src/components/texts/Bold";

interface IProps extends ViewProps {
  type: ContentLayoutType;
  numContents: number;
  onCardViewPress: () => void;
  onListViewPress: () => void;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40px;
  border-radius: 12px;
  padding-left: 14.5px;
  padding-right: 3px;
  background-color: rgb(235, 235, 235);
  margin-bottom: 10px;
`;

const ContentCount = styled(Bold)`
  font-size: 16px;
  color: rgb(155, 155, 155);
  margin-right: 24px;
`;

const ContentCountMardi = styled.Image.attrs({
  source: images.icLogoBigBlue
})`
  width: 52px;
  height: 13px;
`;

const Spacer = styled.View`
  flex: 1;
`;

export function ContentLayoutSelector({
  type,
  numContents,
  onCardViewPress,
  onListViewPress,
  ...props
}: IProps) {
  return (
    <Container {...props}>
      <ContentCount>{numContents}</ContentCount>
      <ContentCountMardi />
      <Spacer />
      <ContentLayoutCardButton
        isActive={type === "CARD"}
        onPress={onCardViewPress}
      />
      <ContentLayoutListButton
        isActive={type === "LIST"}
        onPress={onListViewPress}
      />
    </Container>
  );
}
