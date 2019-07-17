import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { Text } from "src/components/Text";

interface IProps extends TouchableOpacityProps {
  showContent: boolean;
}

const Container = styled.TouchableOpacity`
  width: 100%;
  height: 236px;
  border-radius: 14px;
  border-width: 8px;
  border-color: rgba(255, 255, 255, 0.3);
`;

const BodyContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  background-color: rgb(200, 200, 200);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const BodyText = styled(Text)`
  font-size: 15px;
  color: rgb(155, 155, 155);
  text-align: center;
  margin-bottom: 12px;
`;

const FollowTextContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: rgb(25, 86, 212);
`;

const FollowText = styled(Text).attrs({
  type: "bold"
})`
  font-size: 12px;
  color: rgb(25, 86, 212);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const Avatar = styled.View`
  position: absolute;
  left: 6px;
  bottom: 6px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  opacity: 0.3;
  background-color: white;
`;

const FooterContainer = styled.View`
  width: 100%;
  height: 42px;
  background-color: rgba(255, 255, 255, 0.3);
`;

export function ContentEmptyCard({ showContent, ...props }: IProps) {
  return (
    <Container {...props} activeOpacity={1}>
      <BodyContainer>
        {showContent ? <BodyText>팔로워가 없습니다.</BodyText> : null}
        <Avatar />
      </BodyContainer>
      <FooterContainer />
    </Container>
  );
}
