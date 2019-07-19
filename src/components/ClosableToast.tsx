import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { Bold } from "src/components/texts/Bold";

interface IProps extends TouchableOpacityProps {
  onFollowPress?: () => void;
  onClose?: () => void;
}

const Container = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 93px;
  padding-left: 19px;
  padding-right: 16px;
  padding-top: 20px;
  background-color: rgba(25, 86, 212, 0.8);
`;

const Column = styled.View``;

const Content = styled(Bold)`
  color: white;
  font-size: 12px;
  margin-bottom: 3px;
`;

const UnderlineContent = styled(Content)``;

const Close = styled(IconButton).attrs({ source: images.btnTextDelete })`
  width: 24px;
  height: 24px;
`;

export function ClosableToast({ onClose, onFollowPress, ...props }: IProps) {
  return (
    <Container {...props} activeOpacity={1}>
      <Column>
        <Content>팔로우를 하고 마디를 더 즐겨보세요!</Content>
        <UnderlineContent
          onPress={onFollowPress}
          style={{ textDecorationLine: "underline" }}
        >
          팔로우하러 가기
        </UnderlineContent>
      </Column>
      <Close onPress={onClose} />
    </Container>
  );
}
