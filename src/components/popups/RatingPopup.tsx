import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Text } from "src/components/Text";

interface IProps extends ViewProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const Container = styled.View`
  align-items: center;
  justify-content: center;
  width: 80%;
  border-radius: 14px;
  background-color: rgba(248, 248, 248, 0.82);
  overflow: hidden;
`;

const Header = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 97px;
`;

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 17px;
  color: rgb(0, 0, 0);
  margin-bottom: 2px;
`;

const HeaderContent = styled(Text)`
  font-size: 13px;
  color: rgb(0, 0, 0);
  text-align: center;
`;

const StarContainer = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: #9B9B9B;
`;

const Star = styled(Text)`
  font-size: 23px;
  color: rgb(0, 122, 255);
`;

const FooterContainer = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
`;

const FooterContent = styled(Text).attrs({ type: "bold" })`
  font-size: 17px;
  color: rgb(0, 122, 255);
`;

export function RatingPopup({ onCancel, onConfirm, ...props }: IProps) {
  return (
    <Container {...props}>
      <Header>
        <HeaderTitle>마디를 잘 사용하고 계신가요?</HeaderTitle>
        <HeaderContent>
          앱 스토어 (플레이스토어) 별점을 남겨서{"\n"}마디팀을 응원해주세요!
        </HeaderContent>
      </Header>
      <StarContainer onPress={onConfirm}>
        <Star>☆ ☆ ☆ ☆ ☆</Star>
      </StarContainer>
      <FooterContainer onPress={onCancel}>
        <FooterContent>나중에 하기</FooterContent>
      </FooterContainer>
    </Container>
  );
}
