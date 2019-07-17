import React from "react";
import styled from "styled-components/native";

import { images } from "assets/images";
import { ListenButton } from "src/components/buttons/ListenButton";
import { Text } from "src/components/Text";
import { IAnnounce } from "src/stores/AnnounceStore";
import { colors } from "src/styles/colors";

interface IProps {
  announce: IAnnounce;
  showContent: boolean;
  isPlaying?: boolean;
  onPress?: () => any;
  onListenPress?: () => any;
}

const Container = styled.View`
  width: 100%;
`;

const HeaderContainer = styled.TouchableOpacity`
  width: 100%;
  height: 54px;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  background-color: ${colors.white};
`;

const TitleDateTextColumn = styled.View`
  flex: 1;
`;

const Title = styled(Text).attrs({ numberOfLines: 1 })`
  font-size: 14px;
  color: ${colors.black};
`;

const DateText = styled(Text)`
  font-size: 12px;
  color: rgb(153, 153, 153);
`;

const AnnounceListenButton = styled(ListenButton)`
  margin-right: 10px;
`;

const ShowIconButton = styled.Image.attrs({
  source: images.announceDownward
})`
  width: 24px;
  height: 24px;
`;

const HideIconButton = styled.Image.attrs({ source: images.upward })`
  width: 24px;
  height: 24px;
`;

const ContentContainer = styled.View`
  width: 100%;
  padding: 20px;
  background-color: rgb(248, 248, 248);
`;

const Content = styled(Text)`
  font-size: 13px;
  line-height: 24px;
  color: ${colors.black};
`;

export const AnnounceCard = (props: IProps) => {
  const { announce, isPlaying, onPress, onListenPress, showContent } = props;
  return (
    <Container>
      <HeaderContainer onPress={onPress}>
        <TitleDateTextColumn>
          <Title>{announce.title}</Title>
          <DateText>{announce.created_at.substr(0, 10)}</DateText>
        </TitleDateTextColumn>
        {announce.audio && !!onListenPress ? (
          <AnnounceListenButton onPress={onListenPress} isPlaying={isPlaying} />
        ) : null}
        {showContent ? <HideIconButton /> : <ShowIconButton />}
      </HeaderContainer>
      {showContent ? (
        <ContentContainer>
          <Content>{announce.content}</Content>
        </ContentContainer>
      ) : null}
    </Container>
  );
};
